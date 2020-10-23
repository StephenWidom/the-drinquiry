import React, { useEffect, useRef } from 'react';

const Monster = props => {
    const { monster, health, socket, player, event } = props;
    const didInit = useRef(false);

    useEffect(() => {
        if (!player || !monster)
            return;

        if (!didInit.current) {
            socket.emit('initMonster', monster);
            didInit.current = true;
        }

        if (health === 0) {
            socket.emit('defeatMonster');

            if (monster.code)
                eval(monster.code);
        }
    }, [monster, health]);

    const handleMonsterClick = () => {
        if (!event)
            return;

        if (!monster) {
            socket.emit('drawMonster');
        } else {
            socket.emit('battleMonster', monster.challenge);
        }
    }

    return <div className='Monster' onClick={handleMonsterClick}>
        {monster
            ? <>
                <h3>{monster.name}</h3>
                <img src={require(`../assets/${monster.src}.png`)} alt='' />
                <h5>{monster.challenge}</h5>
                <p><strong>Reward: </strong>{monster.reward.toUpperCase()}</p>
                <h4>{health} / {monster.health}</h4>
            </>
            : <>
                <img className='placeholder' src={require('../assets/fire_breath.png')} alt='' />
                <h6>Monster</h6>
            </>
        }
    </div>;
};

export default Monster;
