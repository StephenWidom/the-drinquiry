import React from 'react';

import Monster from './Monster';
import Event from './Event';
import { getActivePlayer } from '../utils';

const Game = props => {
    const { players, monster, event } = props;
    const activePlayer = getActivePlayer(players);
    return <div className='Game'>
        {activePlayer && <h2>{activePlayer.name}'s Turn</h2>}
        {monster && <Monster monster={monster} />}
        {event
            ? <Event event={event} />
            : <>NO AND THEN</>
        }
    </div>;
};

export default Game;
