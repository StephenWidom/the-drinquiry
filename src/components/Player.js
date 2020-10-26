import React from 'react';

import Health from './Health';
import Potions from './Potions';
import Amulet from './Amulet';
import Shield from './Shield';

import { isBattling, isActive } from '../utils';

const Player = props => {
    const { player, socket, battleTurn, active, started } = props;

    const changeCharacter = () => {
        if (!started)
            socket.emit('changeCharacter');
    }

    return <div className={`Player 
            ${player.dead ? 'dead' : ''}
            ${isActive(active, player) ? 'active' : ''}
            ${isBattling(battleTurn, player) ? 'battling' : 'nah'}
            ${player.connected ? '' : 'disconnected'}
            ${player.winner ? 'winner' : ''}
        `}>
        <img className={`avatar ${started ? '' : 'allowchange'}`} src={require(`../assets/${player.character}.png`)} alt='' onClick={changeCharacter} />
        <h3>{player.name}</h3>
        <Health player={player} socket={socket} />
        <Potions player={player} socket={socket} />
        <Amulet player={player} socket={socket} />
        <Shield player={player} socket={socket} />
    </div>;
};

export default Player;
