require('dotenv').config();
const express = require('express');
const https = require('https');
const fs = require('fs');
const socketIO = require('socket.io');
const _ = require('lodash');

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
            socket.emit('gameHosted');
        } else {
            if (!game.host) {
                socket.emit('joinError', 'Someone needs to host the bish!');
                return;
            }

            if (game.started) {
                socket.emit('joinError', 'The game already started!');
                return;
            }

            const { players } = game;
            if (players.some(p => p.name === name)) {
                socket.emit('joinError', 'Someone is using that name!');
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
                character: getNextCharacter(0),
                dead: false,
                amulet: false,
                book: false,
                shield: false,
                armor: false,
            });
            io.emit('updatePlayers', players);
            socket.emit('goToLobby');
        }
    });

    socket.on('changeCharacter', () => {
        const { players } = game;
        const thisPlayer = players.find(p => p.id === socket.id);
        if (!_.isNil(thisPlayer)) {
            const index = characters.findIndex(c => c === thisPlayer.character);
            thisPlayer.character = getNextCharacter(index);
            io.emit('updatePlayers', players);
        }
    });

    socket.on('startGame', () => {
        const shuffledPlayers = _.shuffle(game.players);
        game.players = shuffledPlayers;
        game.active = shuffledPlayers[0].id;
        game.players[0].active = true;

        io.emit('updatePlayers', game.players);
        io.emit('updateActivePlayer', game.active);
        io.emit('gameStarted');
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

    socket.on('drawEvent', id => {
        const randInt = _.random(events.length - 1);
        game.event = events[randInt];
        io.emit('updateEvent', game.event);
    });

    socket.on('drawMonster', id => {
        game.monster = getMonster();
        io.emit('updateMonster', game.monster);
    });

    socket.on('initMonster', monster => {
        console.log('initMonster');
        game.health = monster.health + game.modifier;
        io.emit('updateMonsterHealth', game.health);

        game.challenge = (monster.challenge === 'random') ? _.sample(['category', 'rhyme', 'sentence']) : monster.challenge;
        switch(game.challenge) {
            case 'category':
                game.prompt = game.categories.pop();
                break;
            case 'rhyme':
                game.prompt = game.rhymes.pop();
                break;
            default: // Sentence
                game.prompt = null;
        }

        io.emit('updatePrompt', game.prompt, game.challenge);

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
    });

    socket.on('takeDamage', () => {
        const { players, battleTurn, health } = game;
        const thisPlayer = players.find(p => p.id === battleTurn);
        if (!_.isNil(thisPlayer)) {
            if (!thisPlayer.shield || health > 2) {
                thisPlayer.health--;
                if (!thisPlayer.health)
                    thisPlayer.dead = true;

                io.emit('updatePlayers', players);
            }
        }
        endBattle();
        io.emit('updateGame', game.health, game.event, game.monster, game.active, game.battleTurn, false, 0, null, null);
    });

    // Player accidentally pressed hit but had an invalid attack
    socket.on('fuckedUp', id => {
        const { players, health } = game;
        const thisPlayer = players.find(p => p.id === id);
        if (!_.isNil(thisPlayer)) {
            if (!thisPlayer.shield || health > 2) {
                thisPlayer.health--;
                if (!thisPlayer.health)
                    thisPlayer.dead = true;

                io.emit('updatePlayers', players);
            }
        }
        endBattle();
        io.emit('updateGame', game.health, game.event, game.monster, game.active, game.battleTurn, false, 0, null, null);
    });

    socket.on('defeatMonster', () => {
        endBattle();
        // Slight delay to peep the reward
        setTimeout(() => {
            io.emit('updateGame', game.health, game.event, game.monster, game.active, game.battleTurn, false, 0, null, null);
        }, 3500);
    });

    socket.on('shufflePlayers', () => {
        const shuffledPlayers = _.shuffle(game.players);
        game.players = shuffledPlayers;
        io.emit('updatePlayers', game.players);
    });

    socket.on('disconnect', () => {
        socket.removeAllListeners();
        const { host } = game;

        if (socket.id === host) {
            resetGame();
        } else {
            return;
        }
    })

});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const nextPlayer = (id, players) => {
    const playerIndex = players.findIndex(p => p.id === id);
    if (playerIndex === -1)
        return false;

    let actualIndex = playerIndex + 1;
    if (actualIndex >= players.length)
        actualIndex = 0;

    if (players[actualIndex].dead === true)
        return nextPlayer(players[actualIndex].id, players);

    return players[actualIndex];
}

const nextPlayerId = (id, players) => {
    const nextJawn = nextPlayer(id, players);
    return nextJawn.id;
};

const getMonster = () => {
    const randInt = _.random(monsters.length - 1);
    const thisMonster = monsters[randInt];
    return (thisMonster.challenge === game.lastChallenge) ? getMonster() : thisMonster;
};

const resetGame = () => {
    game.host = null;
    game.players = [];
    game.started = false;
    game.active = null;
    game.prompt = null;
    game.rhymes = _.shuffle(require('./src/rhymes'));
    game.categories = _.shuffle(require('./src/categories'));
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

};

const getNextCharacter = i => {
    const { players } = game;
    const index = (i > characters.length - 1) ? 0 : i;
    const nextCharacter = characters[index];
    return (players.some(p => p.character === nextCharacter)) ? getNextCharacter(i + 1) : nextCharacter;
}
