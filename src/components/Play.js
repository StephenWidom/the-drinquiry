import React, { PureComponent } from 'react';
import { Redirect } from 'react-router-dom';

import Player from './Player';
import DrawButtons from './DrawButtons';
import Event from './Event';
import Monster from './Monster';
import CardContainer from './CardContainer';
import MobileCardContainer from './MobileCardContainer';
import BattleMessage from './BattleMessage';
import BattleInterface from './BattleInterface';
import Prompt from './Prompt';
import Disconnected from './Disconnected';
import { isInGame, getPlayer, isActive } from '../utils';

export default class Play extends PureComponent {

    render() {
        const { socket, players, started, battle, active, prompt, monster, event, disconnected } = this.props;
        const me = getPlayer(socket.id, players);
        return <div className='Play'>
            {!isInGame(socket.id, players) && <Redirect to='/join' />}
            <div className='container'>
                {disconnected
                    ? <Disconnected />
                    : <>
                    {me && <Player player={me} socket={socket} {...this.props} />}
                    {me && isActive(active, me)
                        ? <>
                            {battle && <>
                                <BattleMessage {...this.props} />
                                <BattleInterface player={me} {...this.props} />
                            </>}
                            <DrawButtons player={me} socket={socket} {...this.props} />
                            <CardContainer>
                                {!battle && <Event {...this.props} player={me} />}
                                <Monster {...this.props} player={me} />
                                {battle && !!prompt && <Prompt {...this.props} />}
                            </CardContainer>
                            <MobileCardContainer>
                                {!battle && event && !monster && !prompt && <Event {...this.props} player={me} />}
                                {monster && !battle && <Monster {...this.props} player={me} />}
                            </MobileCardContainer>
                        </>
                        : battle
                            ? <>
                                <BattleMessage {...this.props} />
                                <BattleInterface player={me} {...this.props} />
                            </>
                            : started
                                ? <h2>Awaiting the battle...</h2>
                                : <h2>Waiting for the game to begin</h2>
                    }
                    </>
                }
            </div>
        </div>;
    }
}
