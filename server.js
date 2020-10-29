require('dotenv').config();
const express = require('express');
const https = require('https');
const fs = require('fs');
const socketIO = require('socket.io');
const _ = require('lodash');
const fetch = require('node-fetch');

const PORT = 4003;

const options = {
    key: fs.readFileSync(process.env.REACT_APP_KEY),
    cert: fs.readFileSync(process.env.REACT_APP_CERT)
};

const app = express();
const server = https.createServer(options, app);
const io = socketIO(server);

// Import characters and shuffle 'em up
const characters = require('./src/characters');

// Grab monster and event cards
const monsters = _.shuffle(require('./src/monsters'));
const events = _.shuffle(require('./src/events'));

const game = {
    players: [],
    host: null,
    started: false,
    active: null,
    battleTurn: null,
    battle: false,
    event: null,
    monster: null,
    modifier: 0,
    health: null,
    prompt: null,
    rhymes: _.shuffle(require('./src/rhymes')),
    categories:  _.shuffle(require('./src/categories')),
    challenge: null,
    lastChallenge: null,
    suddenDeath: false,
    winner: null,
    triviaCategory: null,
};

io.on('connection', socket => {
    console.log('Connection made!', socket.id);

    socket.on('joinSocketRoom', (host, name) => {
        if (host) {
            if (game.host) {
                socket.emit('joinError', 'Someone is hosting the bish already!');
                return;
            }
            game.host = socket.id;
            game.triviaQuestions = fetchTrivia();
            socket.emit('gameHosted');
        } else {
            if (!game.host) {
                socket.emit('joinError', 'Someone needs to host the bish!');
                return;
            }

            const { players } = game;
            // Someone tryna reconnect
            // Have to search by name as id would change on reconnect
            const thisPlayer = players.find(p => p.name === name);
            // If we've found a player with this name
            if (!_.isNil(thisPlayer)) {
                if (thisPlayer.connected) {
                    socket.emit('joinError', 'Someone is using that name!');
                    return;
                } else {
                    thisPlayer.connected = true;
                    thisPlayer.id = socket.id;
                    io.emit('updatePlayers', players);
                    socket.emit('goToLobby');
                    if (game.started)
                        socket.emit('gameStarted', true);
                    return;
                }
            }

            if (game.started) {
                socket.emit('joinError', 'The game already started!');
                return;
            }

            if (players.length >= 8) {
                socket.emit('joinError', 'Game is full, brah!');
                return;
            }

            players.push({
                name,
                id: socket.id,
                health: 3,
                potions: 0,
                connected: true,
                character: getNextCharacter(_.random(characters.length - 1), name),
                dead: false,
                amulet: false,
                book: false,
                shield: false,
                armor: false,
                scroll: true,
            });
            io.emit('updatePlayers', players);
            socket.emit('goToLobby');
        }
    });

    socket.on('changeCharacter', () => {
        const { players } = game;
        const thisPlayer = players.find(p => p.id === socket.id);
        if (!_.isNil(thisPlayer)) {
            // Special characters / easter eggs
            const reservedNames = [
                'plumson',
                'fuchiass',
                'obi',
            ];
            if (reservedNames.includes(thisPlayer.character))
                return console.log('nice name');

            const index = characters.findIndex(c => c === thisPlayer.character);
            thisPlayer.character = getNextCharacter(index);
            io.emit('updatePlayers', players);
        }
    });

    socket.on('startGame', () => {
        const shuffledPlayers = _.shuffle(game.players);
        game.players = shuffledPlayers;
        game.active = shuffledPlayers[0].id;
        game.started = true;
        game.players[0].active = true;

        io.emit('updatePlayers', game.players);
        io.emit('updateActivePlayer', game.active);
        io.emit('gameStarted', true);
    });

    socket.on('updateHealth', (id, modifier) => {
        const { players } = game;
        const thisPlayer = players.find(p => p.id === id);
        if (!_.isNil(thisPlayer)) {
            thisPlayer.health = thisPlayer.health + modifier;
            if (thisPlayer.health > 5)
                thisPlayer.health = 5;
            if (!thisPlayer.health)
                thisPlayer.dead = true;

            checkWinCondition();
            io.emit('updatePlayers', players);
        }
    });

    socket.on('updatePotions', (id, modifier) => {
        const { players } = game;
        const thisPlayer = players.find(p => p.id === id);
        if (!_.isNil(thisPlayer)) {
            thisPlayer.potions = thisPlayer.potions + modifier;
            if (thisPlayer.potions > 3)
                thisPlayer.potions = 3;

            if (thisPlayer.potions < 0)
                thisPlayer.potions = 0;
            io.emit('updatePlayers', players);
        }
    });

    socket.on('updateItem', (id, item, toggle = false) => {
        const { players } = game;
        const thisPlayer = players.find(p => p.id === id);
        if (!_.isNil(thisPlayer)) {
            thisPlayer[item] = (toggle) ? !thisPlayer[item] : true;
            io.emit('updatePlayers', players);
        }
    });

    socket.on('loseItems', id => {
        const { players } = game;
        const thisPlayer = players.find(p => p.id === id);
        if (!_.isNil(thisPlayer)) {
            thisPlayer.amulet = false;
            thisPlayer.scroll = false;
        }
        io.emit('updatePlayers', players);
    });

    socket.on('drawEvent', player => {
        game.event = pickEvent(player);
        io.emit('updateEvent', game.event);
    });

    socket.on('drawMonster', id => {
        game.monster = getMonster();
        io.emit('updateMonster', game.monster);
    });

    socket.on('initMonster', monster => {
        game.health = monster.health + game.modifier;
        io.emit('updateMonsterHealth', game.health);

        game.challenge = (monster.challenge === 'random') ? getRandomChallenge() : monster.challenge;

        game.prompt = getPrompt();
        io.emit('updatePrompt', game.prompt, game.challenge, game.triviaCategory);
    });

    socket.on('consumeScroll', () => {
        io.emit('updatePrompt', null, game.challenge, null);
        setTimeout(() => {
            game.prompt = getPrompt(game.challenge);
            io.emit('updatePrompt', game.prompt, game.challenge, game.triviaCategory);
            
            const { players } = game;
            const thisPlayer = players.find(p => p.id === game.active);
            if (!_.isNil(thisPlayer)) {
                thisPlayer.scroll = false;
                io.emit('updatePlayers', players);
            }
        }, 1000);
    });

    socket.on('updateModifier', modifier => {
        game.modifier = modifier;
    });

    socket.on('battleMonster', challenge => {
        game.battle = true;
        game.battleTurn = game.active;
        io.emit('updateBattle', true, game.battleTurn);
        
    });

    socket.on('hitMonster', () => {
        game.health--;
        if (game.health < 0)
            game.health = 0;

        io.emit('updateMonsterHealth', game.health);
        const nextToGo = nextPlayer(game.battleTurn, game.players); 
        game.battleTurn = nextToGo.id;
        io.emit('updateBattle', true, game.battleTurn);

        // If it's a trivia battle
        if (game.triviaCategory) {
            game.prompt = getPrompt();
            io.emit('updatePrompt', game.prompt, game.challenge, game.triviaCategory);
        }

    });

    socket.on('skipAttack', () => {
        const { players } = game;
        const thisPlayer =  players.find(p => p.id === game.active);
        if (!_.isNil(thisPlayer)) {
            thisPlayer.potions--;
            io.emit('updatePlayers', players);
        }
        const nextToGo = nextPlayer(game.battleTurn, game.players); 
        game.battleTurn = nextToGo.id;
        io.emit('updateBattle', true, game.battleTurn);

        // If it's a trivia battle
        if (game.triviaCategory) {
            game.prompt = getPrompt();
            io.emit('updatePrompt', game.prompt, game.challenge, game.triviaCategory);
        }
    });

    socket.on('missAttack', () => {
        const { players, battleTurn, health } = game;
        const thisPlayer = players.find(p => p.id === battleTurn);
        if (!_.isNil(thisPlayer)) {
            if (!thisPlayer.shield || health > 2) {

                takeDamage(thisPlayer);
                io.emit('updatePlayers', players);
            }
        }
        endBattle();
        io.emit('updateGame', game.health, game.event, game.monster, game.active, game.battleTurn, false, 0, null, null, null, null);
    });

    // Player accidentally pressed hit but had an invalid attack
    socket.on('fuckedUp', id => {
        const { players, health } = game;
        const thisPlayer = players.find(p => p.id === id);
        if (!_.isNil(thisPlayer)) {
            if (!thisPlayer.shield || health > 1) { // Health must be 1 because one was subtracted by accidental hit
                takeDamage(thisPlayer);

                io.emit('updatePlayers', players);
            }
        }
        endBattle();
        io.emit('updateGame', game.health, game.event, game.monster, game.active, game.battleTurn, false, 0, null, null, null, null);
    });

    socket.on('revealAnswer', () => {
        if (!game.battle)
            return;

        game.triviaAnswer = game.question.answer.replace(/(<([^>]+)>)/gi, "");
        io.emit('revealAnswer', game.triviaAnswer);
    });

    socket.on('defeatMonster', () => {
        endBattle();
        io.emit('updateBattle', false, null);
        // Slight delay to peep the reward
        setTimeout(() => {
            io.emit('updateGame', game.health, game.event, game.monster, game.active, game.battleTurn, false, 0, null, null, null, null);
        }, 3800);
    });

    socket.on('shufflePlayers', () => {
        const shuffledPlayers = _.shuffle(game.players);
        game.players = shuffledPlayers;
        io.emit('updatePlayers', game.players);
    });

    socket.on('newTriviaQuestion', () => {
        if (game.triviaCategory) {
            game.prompt = getPrompt();
            io.emit('updatePrompt', game.prompt, game.challenge, game.triviaCategory);
        }
    });

    socket.on('absoluteDisaster', () => {
        const { players } = game;
        players.forEach(player => {
            takeDamage(player);
        });
        io.emit('updatePlayers', players);
    });

    socket.on('giveEveryoneScrolls', () => {
        const { players } = game;
        players.forEach(p => {
            p.scroll = true;
        });
        io.emit('updatePlayers', players);
    });

    socket.on('runItBack', () => {
        // Soft reset
        endBattle();
        game.started = false;
        game.active = null;
        game.prompt = null;
        game.suddenDeath = false;
        game.winner = null;
        io.emit('updateGame', null, null, null, null, null, false, 0, null, null, null, null, null);
        io.emit('gameWon', null);
        const { players } = game;
        players.forEach(p => {
            p.scroll = true;
            p.amulet = false;
            p.health = 3;
            p.potions = 0;
            p.dead = false;
        });
        io.emit('updatePlayers', players);
    });

    socket.on('disconnect', () => {
        socket.removeAllListeners();
        const { host, players } = game;

        if (socket.id === host) {
            resetGame();
            io.emit('bootPlayer');
        } else {
            // Game has already been reset
            if (!host)
                return;

            const thisPlayer = players.find(p => p.id === socket.id);
            if (!_.isNil(thisPlayer)) {
                thisPlayer.connected = false;
                io.emit('updatePlayers', players);

                // What if it was their turn when they disconnected
                if (game.active === socket.id) {
                    endBattle();
                    io.emit('updateGame', game.health, game.event, game.monster, game.active, game.battleTurn, false, 0, null, null);
                }

            }
        }
    })

});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const nextPlayer = (id, players) => {
    if (!players.length)
        return false;

    if (players.every(p => p.dead || !p.connected))
        return false;

    const playerIndex = players.findIndex(p => p.id === id);
    if (playerIndex === -1)
        return false;

    let actualIndex = playerIndex + 1;
    if (actualIndex >= players.length)
        actualIndex = 0;

    if (players[actualIndex].dead || !players[actualIndex].connected)
        return nextPlayer(players[actualIndex].id, players);

    return players[actualIndex];
}

const nextPlayerId = (id, players) => {
    const nextJawn = nextPlayer(id, players);
    return nextJawn ? nextJawn.id : null;
};

const getMonster = () => {
    // If two players left, boss battle
    if (game.suddenDeath) {
        return {
            name: 'Kratos on Acid',
            health: 99,
            challenge: 'random',
            reward: 'none',
            src: 'kratos_on_acid',
        };
    }
    const randInt = _.random(monsters.length - 1);
    const thisMonster = monsters[randInt];
    return (thisMonster.challenge === game.lastChallenge) ? getMonster() : thisMonster;
};

const takeDamage = player => {
    player.health--;
    if (!player.health)
        player.dead = true;

    checkWinCondition();
};

const checkWinCondition = () => {
    const { players } = game;
    const alivePlayers = players.filter(p => !p.dead);

    // If no one is alive
    if (alivePlayers.length === 0) {
        // No one wins
    } else if (alivePlayers.length === 1) {
        // We have a winner!
        game.started = false;
        game.winner = alivePlayers[0];
        io.emit('gameWon', game.winner);
    } else if (alivePlayers.length === 2) {
        game.suddenDeath = true;
    }
    return;
};

const pickEvent = player => {
    const randInt = _.random(events.length - 1);
    const randEvent = events[randInt];

    // Don't give em a scroll if they've got one
    if (randEvent.src === 'scroll_yellow' && (player.scroll || game.suddenDeath))
        return pickEvent(player);

    // Don't give em an amulet if they've got one
    if (randEvent.src === 'urand_bloodlust_new' && player.amulet)
        return pickEvent(player);

    // Don't draw the discard item one if they don't have items
    if (randEvent.src === 'unseen_item_old' && !player.amulet && !player.scroll)
        return pickEvent(player);

    // Don't let the poisonous cloud actually kill a player
    if (randEvent.src === 'cloud_meph_2' && player.health === 1)
        return pickEvent(player);

    // Don't fucks wit some events during sudden death
    if (game.suddenDeath && (randEvent.src === 'necromutation_old' || randEvent.src === 'misc_lantern' || randEvent.src === 'rune_abyss' || randEvent.src === 'cloud_black_smoke'))
        return pickEvent(player);

    return randEvent;
};

const getRandomChallenge = () => {
    const randomChallange = _.sample(['category', 'rhyme', 'sentence', 'trivia']);
    return (randomChallange === game.lastChallenge) ? getRandomChallenge() : randomChallange;
};

const getPrompt = () => {
    switch(game.challenge) {
        case 'category':
            game.triviaCategory = null;
            return game.categories.pop();
        case 'rhyme':
            game.triviaCategory = null;
            return game.rhymes.pop();
        case 'trivia':
            const questionObj = game.triviaQuestions.pop();
            if (!questionObj)
                return getPrompt();

            if (questionObj.question.trim() === '')
                return getPrompt();

            game.question = questionObj;
            game.triviaCategory = questionObj.category.title;
            return questionObj.question;
        default: // Sentence
            return 'sentence';
    }
};

const fetchTrivia = () => {
    fetch('https://jservice.io/api/random?count=10').then(response => response.json()).then(response => {
        game.triviaQuestions = response;
    }).catch(reason => console.log(reason));
}

const resetGame = () => {
    game.host = null;
    game.players = [];
    game.started = false;
    game.active = null;
    game.prompt = null;
    game.rhymes = _.shuffle(require('./src/rhymes'));
    game.categories = _.shuffle(require('./src/categories'));
    game.suddenDeath = false;
};

const endBattle = () => {
    game.health = null;
    game.event = null;
    game.monster = null;
    game.active = nextPlayerId(game.active, game.players);
    game.battleTurn = null;
    game.battle = false;
    game.modifier = 0;
    game.prompt = null;
    game.lastChallenge = game.challenge;
    game.challenge = null;
    game.triviaCategory = null;
    game.triviaAnswer = null;
};

const getNextCharacter = (i, name = null) => {
    switch(name) {
        case 'FUCHIASS':
            return 'fuchiass';
        case 'OBI':
            return 'obi';
        case 'PLUMSON':
        case 'PLUM':
        case 'SKRIMPSON':
            return 'plumson';
        default:
            break;
    }
    const { players } = game;
    const index = (i > characters.length - 1) ? 0 : i;
    const nextCharacter = characters[index];
    return (players.some(p => p.character === nextCharacter)) ? getNextCharacter(i + 1) : nextCharacter;
}
