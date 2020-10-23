import React, { useEffect, useRef } from 'react';
import { Button } from '@blueprintjs/core';

import Players from './Players';
import { AppToaster } from './AppToaster';

const Wait = props => {
    const { players, socket } = props;
    const prevPlayers = useRef([]);

    useEffect(() => {
        if (!players.length)
            return;

        if (prevPlayers.current.length !== players.length) {
            if (prevPlayers.current.length < players.length) {
                const newPlayer = players[players.length - 1];
                AppToaster.show({ message: `${newPlayer.name} joined!`, intent: 'success' });
            }
        }

        prevPlayers.current = players;

    }, [players]);

    const startGame = () => {
        socket.emit('startGame');
    }

    return <div className='Wait'>
        <div className="container">
            <h1>Who's In?</h1>
            {!!players.length && <Players {...props} />}
            <Button
                text='Go!'
                className='bp3-fill bp3-large bp3-intent-success'
                onClick={startGame}
                disabled={!players.length}
            />
        </div>
    </div>;
};

export default Wait;
