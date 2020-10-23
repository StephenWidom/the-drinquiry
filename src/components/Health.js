import React from 'react';
import { Icon } from '@blueprintjs/core';
import _ from 'lodash';

const Health = props => {
    const { player, socket } = props;

    return <div className='Health'>
        {_.times(player.health, h => <img
            key={h + player.name}
            src={require('../assets/heart.png')}
            alt='heart'
            onClick={() => socket.emit('updateHealth', player.id, -1)}
        />)}
        {player.health < 5 && !player.dead && <Icon
            icon='plus'
            iconSize={32}
            onClick={() => socket.emit('updateHealth', player.id, 1)}
        />}
    </div>;
};

export default Health;
