import React from 'react';
import { Icon } from '@blueprintjs/core';
import _ from 'lodash';

const Potions = props => {
    const { player, socket } = props;

    return <div className='Potions'>
        {_.times(player.potions, h => <img
            key={h + player.name}
            src={require('../assets/cyan_new.png')}
            alt='potion'
            onClick={() => socket.emit('updatePotions', player.id, -1)}
        />)}
        {player.potions < 3 && !player.dead && <Icon
            icon='plus'
            iconSize={32}
            onClick={() => socket.emit('updatePotions', player.id, 1)}
        />}
    </div>;
};

export default Potions;
