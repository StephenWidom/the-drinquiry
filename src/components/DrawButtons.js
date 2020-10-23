import React, { useState } from 'react';
import { Button } from '@blueprintjs/core';

const DrawButtons = props => {
    const [eventDrawn, setButton] = useState(true);
    const { player, socket } = props;

    const drawEvent = () => {
        socket.emit('drawEvent', player.id);
        setButton(false);
    }
    return <div className='DrawButtons'>
        <Button
            text='Draw Event'
            large={true}
            fill={true}
            onClick={drawEvent}
            disabled={!eventDrawn}
        />
        <Button
            text='Draw Monster'
            large={true}
            fill={true}
            onClick={() => socket.emit('drawMonster', player.id)}
            disabled={eventDrawn}
        />
    </div>;
};

export default DrawButtons;
