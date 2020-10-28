import React, { PureComponent } from 'react';
import { Redirect } from 'react-router-dom';

import Player from './Player';
import DrawButtons from './DrawButtons';
import Event from './Event';
import Monster from './Monster';
import Trivia from './Trivia';
import CardContainer from './CardContainer';
import MobileCardContainer from './MobileCardContainer';
import BattleInterface from './BattleInterface';
import Disconnected from './Disconnected';
import ScrollButton from './ScrollButton';
import { isInGame, getPlayer, isActive } from '../utils';

export default class Play extends PureComponent {

    render() {
        const { socket, players, started, battle, active, prompt, monster, event, disconnected, health, triviaCategory } = this.props;
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
                                <BattleInterface player={me} {...this.props} />
                            </>}
                            <DrawButtons player={me} socket={socket} {...this.props} />
                            <CardContainer>
                                {triviaCategory
                                    ? <Trivia {...this.props} player={me} />
                                    : <Event {...this.props} player={me} host={false} />
                                }
                                {prompt && me.scroll && !battle && prompt !== 'sentence' && !!health && <ScrollButton {...this.props} />}
                                <Monster {...this.props} player={me} />
                            </CardContainer>
                            <MobileCardContainer>
                                {!battle && event && !monster && !prompt && <Event {...this.props} player={me} />}
                                {monster && !battle && <Monster {...this.props} player={me} />}
                            </MobileCardContainer>
                        </>
                        : battle
                            ? <BattleInterface player={me} {...this.props} />
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
