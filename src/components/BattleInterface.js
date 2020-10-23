import React from 'react';

import { isBattling } from '../utils';

const BattleInterface = props => {
    const { player, socket, battleTurn } = props;
    const hitMonster = () => {
        socket.emit('hitMonster');
    }

    const missMonster = () => {
        socket.emit('takeDamage');
    }

    const skipAttack = () => {
        socket.emit('skipAttack');
    }

    return <div className={`BattleInterface ${isBattling(battleTurn, player) ? '' : 'inactive'}`}>
        <div className='hit' onClick={hitMonster}>
            <img src={require('../assets/unseen_weapon_new.png')} alt='' />
        </div>
        {!!player.potions && <div className='skip' onClick={skipAttack}>
            <img src={require('../assets/cyan_new.png')} alt='potion' />
        </div>}
        <div className='miss' onClick={missMonster}>
            <img src={require('../assets/sensed_monster_nasty.png')} alt='' />
        </div>
    </div>
};

export default BattleInterface;
