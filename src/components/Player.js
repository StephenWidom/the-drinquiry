import React from 'react';
import { useSpring, animated } from 'react-spring';

import Health from './Health';
import Potions from './Potions';
import Amulet from './Amulet';
import Scroll from './Scroll';
import Timer from './Timer';

import { isBattling, isActive } from '../utils';

const Player = props => {
    const { player, socket, battleTurn, active, started, slim, battle } = props;
    const styles = useSpring({
        borderColor: isBattling(battleTurn, player) ? '#EC4C70' : isActive(active, player) ? '#413482' : '#8F6690',
        height: isActive(active, player) ? 217 : slim ? 95 : 217,
    });

    const changeCharacter = () => {
        if (!started)
            socket.emit('changeCharacter');
    }

    return <animated.div style={styles} className={`Player 
            ${player.dead ? 'dead' : ''}
            ${isActive(active, player) ? 'active' : ''}
            ${isBattling(battleTurn, player) ? 'battling' : 'nah'}
            ${player.connected ? '' : 'disconnected'}
            ${player.winner ? 'winner' : ''}
        `}>
        <img className={`avatar ${started ? '' : 'allowchange'}`} src={require(`../assets/${player.character.class}.png`)} alt='' onClick={changeCharacter} />
        <h3>{player.name}</h3>
        <Health player={player} socket={socket} />
        <Potions player={player} socket={socket} />
        <Amulet player={player} socket={socket} />
        <Scroll player={player} socket={socket} />
        {!slim && battle && isBattling(battleTurn, player) && <Timer {...props} socket={socket} host={slim} />}
    </animated.div>;
};

export default Player;
