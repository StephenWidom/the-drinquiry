import React from 'react';

import Health from './Health';
import Potions from './Potions';
import Amulet from './Amulet';
import Shield from './Shield';

const Player = props => {
    const { player, socket } = props;
    return <div className={`Player ${player.dead ? 'dead' : ''}`}>
        <img src={require(`../assets/${player.character}.png`)} alt='' />
        <h3>{player.name}</h3>
        <Health player={player} socket={socket} />
        <Potions player={player} socket={socket} />
        <Amulet player={player} socket={socket} />
        <Shield player={player} socket={socket} />
    </div>;
};

export default Player;
