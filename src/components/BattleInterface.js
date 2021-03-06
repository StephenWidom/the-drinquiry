import React from 'react';
import LongPressable from 'react-longpressable';

import { isBattling } from '../utils';

const BattleInterface = props => {
    const { player, socket, battleTurn, haunted } = props;
    const hitMonster = () => {
        if (isBattling(battleTurn, player))
            socket.emit('hitMonster');
    }

    const missMonster = () => {
        if (isBattling(battleTurn, player))
            socket.emit('missAttack');
    }

    const skipAttack = () => {
        if (haunted)
            return;

        if (isBattling(battleTurn, player))
            socket.emit('skipAttack');
    }

    const fuckedUp = () => {
        socket.emit('fuckedUp', player.id);
    }

    return <div className={`BattleInterface ${isBattling(battleTurn, player) ? '' : 'inactive'}`}>
        <div className='hit' onClick={hitMonster}>
            <img src={require('../assets/unseen_weapon_new.png')} alt='' />
        </div>
        {!!player.potions && <div className='skip' onClick={skipAttack}>
            {haunted
                ? <img src={require('../assets/ghost.png')} alt='ghost' />
                : <img src={require('../assets/cyan_new.png')} alt='potion' />
            }
        </div>}
        <LongPressable
            onShortPress={missMonster}
            onLongPress={fuckedUp}
            longPressTime={1000}
        >
            <div className='miss'>
                <img src={require('../assets/sensed_monster_nasty.png')} alt='' />
            </div>
        </LongPressable>
    </div>
};

export default BattleInterface;
