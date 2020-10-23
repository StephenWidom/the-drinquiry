import React, { useEffect, useRef } from 'react';

import Players from './Players';
import Monster from './Monster';
import Event from './Event';
import CardContainer from './CardContainer';
import Prompt from './Prompt';
import BattleMessage from './BattleMessage';
import { getActivePlayer } from '../utils';

const Game = props => {
    const { players, battle, prompt, active } = props;
    const activePlayer = useRef(getActivePlayer(active, players));
    useEffect(() => {
        activePlayer.current = getActivePlayer(active, players);
    }, [active, players]);
    return <div className='Game'>
        {activePlayer.current && <h2>{activePlayer.current.name}'s Turn</h2>}
        <Players {...props} slim={true} />
        <CardContainer>
            {!battle &&<Event {...props} />}
            <Monster {...props} />
            {battle && !!prompt && <Prompt {...props} />}
        </CardContainer>
        {battle && <BattleMessage {...props} />}
    </div>;
};

export default Game;
