import React from 'react';
import { Button } from '@blueprintjs/core';

const EndRoundButton = props => {
    const { socket } = props;
    return <div className='EndRoundButton'>
        <Button
            large={true}
            text='End Round'
            onClick={() => socket.emit('endRound')}
            className='bp3-intent-warning'
        />
    </div>;
};

export default EndRoundButton;
