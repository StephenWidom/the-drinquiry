import React, { useState } from 'react';
import { Button } from '@blueprintjs/core';

const Haunting = props => {
    const { battle, players, socket } = props;
    const [hauntedPlayer, setHauntedPlayer] = useState(null);
    const [doneHaunting, setDoneHaunting] = useState(false);

    const hauntPlayer = player => {
        setHauntedPlayer(player);
    };

    const hauntTheir = thing => {
        if (!hauntedPlayer)
            return;

        socket.emit('hauntPlayer', hauntedPlayer.id, thing);
        setDoneHaunting(true);
    };

    const shuffleOrder = () => {
        socket.emit('shufflePlayers', true);
        setDoneHaunting(true);
    }

    const buffMonster = () => {
        socket.emit('buffMonster', 3);
        setDoneHaunting(true);
    }

    return <div className='Haunting'>
        {battle
            ? doneHaunting
                ? <h2>LOL nice</h2>
                : hauntedPlayer
                    ? <>
                        <h2>Fuck {hauntedPlayer.name}'s shit up!</h2>
                        <Button text='Timer' onClick={() => hauntTheir('timer')} large={true} fill={true} />
                        <Button text='Potion' onClick={() => hauntTheir('potions')} large={true} fill={true} />
                    </>
                    : <>
                        <h2>Haunt a Player</h2>
                        {players.map(p => !p.dead && <Button onClick={() => hauntPlayer(p)} key={p.id} large={true} fill={true}>{p.name}</Button>)}
                        <h2>Fuck with other shit</h2>
                        <Button onClick={shuffleOrder} large={true} fill={true} text='Shuffle Order' />
                        <Button onClick={buffMonster} large={true} fill={true} text='+3 Strengh to Monster' />
                    </>
            : <h2>Ya done, son. Or are you?</h2>
        }
    </div>;
};

export default Haunting;
