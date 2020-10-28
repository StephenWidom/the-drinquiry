import React from 'react';

import Players from './Players';
import Monster from './Monster';
import Event from './Event';
import Trivia from './Trivia';
import CardContainer from './CardContainer';
import { getActivePlayer } from '../utils';

const Game = props => {
    const { players, active, triviaCategory } = props;
    const activePlayer = getActivePlayer(active, players);

    return <div className='Game'>
        {activePlayer && <h2>{activePlayer.name}'s Turn</h2>}
        <Players {...props} slim={true} />
        <CardContainer>
            {triviaCategory
                ? <Trivia {...props} player={activePlayer} />
                : <Event {...props} player={activePlayer} host={true} />
            }
            <Monster {...props} player={activePlayer} host={true} />
        </CardContainer>
    </div>;
};

export default Game;
