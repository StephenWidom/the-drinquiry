import React from 'react';

import Player from './Player';

const Players = props => {
    const { players, socket } = props;
    return <div className={`Players ${props.slim ? 'slim' : ''}`}>
        {players.map(player =>
            <Player key={player.id} player={player} socket={socket} {...props} />
        )}
    </div>;
};

export default Players;
