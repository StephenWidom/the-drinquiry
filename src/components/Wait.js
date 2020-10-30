import React, { PureComponent } from 'react';
import { Button } from '@blueprintjs/core';

import Players from './Players';
import { AppToaster } from './AppToaster';

export default class Wait extends PureComponent {
    componentDidUpdate(prevProps) {
        const { players } = this.props;
        if (prevProps.players.length < players.length) {
            const newPlayer = players[players.length - 1];
            AppToaster.show({ message: `${newPlayer.name} joined!`, intent: 'success' });
        }
    }

    render() {
        const { players, socket } = this.props;
        return <div className='Wait'>
            <div className="container">
                <h1>Who's In?</h1>
                {!!players.length && <Players {...this.props} />}
                <Button
                    text='Go!'
                    className='bp3-fill bp3-large bp3-intent-success'
                    onClick={() => socket.emit('startGame')}
                    disabled={!players.length}
                />
            </div>
        </div>;
    }
}

