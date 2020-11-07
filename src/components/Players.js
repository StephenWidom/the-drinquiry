import React from 'react';

import EndRoundButton from './EndRoundButton';
import Player from './Player';

const Players = props => {
    const { players, socket, battle } = props;
    return <div className={`Players ${props.slim ? 'slim' : ''}`}>
        {players.map(player =>
            <Player key={player.id} player={player} socket={socket} {...props} />
        )}
        {battle && <EndRoundButton socket={socket} />}
    </div>;
};

export default Players;
