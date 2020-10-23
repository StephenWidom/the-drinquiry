import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import Player from './Player';
import DrawButtons from './DrawButtons';
import Event from './Event';
import Monster from './Monster';
import { isInGame, getPlayer } from '../utils';

export default class Play extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        const { socket, players, event, monster } = this.props;
        const me = getPlayer(socket.id, players);
        return <div className='Play'>
            {!isInGame(socket.id, players) && <Redirect to='/join' />}
            <div className='container'>
                {me && <Player player={me} socket={socket} />}
                {me && me.active && <DrawButtons player={me} socket={socket} />}
                {event && <Event {...this.props} player={me} />}
                {monster && <Monster {...this.props} player={me} />}
            </div>
        </div>;
    }
}
