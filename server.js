require('dotenv').config();
const express = require('express');
const https = require('https');
const fs = require('fs');
const socketIO = require('socket.io');
const _ = require('lodash');

const PORT = 4002;

const options = {
    key: fs.readFileSync(process.env.REACT_APP_KEY),
    cert: fs.readFileSync(process.env.REACT_APP_CERT)
};

const app = express();
const server = https.createServer(options, app);
const io = socketIO(server);

// Import characters and shuffle 'em up
const characters = _.shuffle(require('./src/characters'));

// Grab monster and event cards
const monsters = _.shuffle(require('./src/monsters'));
const events = _.shuffle(require('./src/events'));

const game = {
    players: [],
    host: null,
    started: false,
    active: null,
    event: null,
    monster: null,
    modifier: 0,
    health: null,
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
                character: characters.shift(),
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

    socket.on('startGame', () => {
        const { players } = game;
        _.shuffle(players);
        players[0].active = true;

        io.emit('updatePlayers', players);
        io.emit('gameStarted');
    });

    socket.on('updateHealth', (id, modifier) => {
        console.log('updatingHealth');
        console.log(id);
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

    socket.on('updateItem', (id, item) => {
        const { players } = game;
        const thisPlayer = players.find(p => p.id === id);
        if (!_.isNil(thisPlayer)) {
            thisPlayer[item] = !thisPlayer[item];
            io.emit('updatePlayers', players);
            console.log('updated', item);
        }
    });

    socket.on('drawEvent', id => {
        _.shuffle(events);
        game.event = events[0];
        io.emit('updateEvent', game.event);
    });

    socket.on('drawMonster', id => {
        _.shuffle(monsters);
        game.monster = monsters[0];
        io.emit('updateMonster', game.monster);
    });

    socket.on('disconnect', () => {
        socket.removeAllListeners();
        const { host } = game;

        if (socket.id === host) {
            game.host = null;
            game.players = [];
            game.started = false;
            game.active = null;
        } else {
            return;
        }
    })

});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

