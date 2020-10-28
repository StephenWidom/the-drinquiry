import React from 'react';
import { Button } from '@blueprintjs/core';

const DrawButtons = props => {
    const { player, socket, event, monster, battle, health } = props;

    const drawEvent = () => {
        socket.emit('drawEvent', player);
    }

    const drawMonster = () => {
        socket.emit('drawMonster', player.id);
    }

    return <div className='DrawButtons'>
        {event && monster
            ? health
                ? <>{!battle && <h2>Click monster to battle!</h2>}</>
                : <h2>Caught him square! Noice!</h2>
            : <>

                <Button
                    text='Draw Event'
                    large={true}
                    fill={true}
                    onClick={drawEvent}
                    disabled={props.event}
                />
                <Button
                    text='Draw Monster'
                    large={true}
                    fill={true}
                    onClick={drawMonster}
                    disabled={!props.event || props.monster}
                />
            </>
        }
    </div>;
};

export default DrawButtons;
