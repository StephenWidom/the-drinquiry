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
import BlankCard from './BlankCard';
import Winner from './Winner';
import { isInGame, getPlayer, isActive, isBattling } from '../utils';

export default class Play extends PureComponent {

    render() {
        const { socket, players, winner, started, battle, active, prompt, monster, event, disconnected, health, triviaCategory, battleTurn } = this.props;
        const me = getPlayer(socket.id, players);
        return <div className='Play'>
            {!isInGame(socket.id, players) && <Redirect to='/join' />}
            <div className='container'>
                {disconnected
                    ? <Disconnected />
                    : winner
                        ? <Winner {...this.props} />
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
                                        ? isBattling(battleTurn, me) || battleTurn === null
                                            ? <Trivia {...this.props} player={me} />
                                            : <BlankCard {...this.props} />
                                        : <Event {...this.props} player={me} host={false} />
                                    }
                                    {prompt && me.scroll && !battle && prompt !== 'sentence' && !!health && <ScrollButton {...this.props} />}
                                    <Monster {...this.props} player={me} />
                                </CardContainer>
                                <MobileCardContainer>
                                    {!battle && event && !monster && !prompt && <Event {...this.props} player={me} />}
                                    {monster && !battle && <Monster {...this.props} player={me} host={false} />}
                                </MobileCardContainer>
                            </>
                            : battle // Not active player, show cards, but don't run code
                                ? <>
                                    <BattleInterface player={me} {...this.props} />
                                    <CardContainer>
                                        {me && isBattling(battleTurn, me) && triviaCategory && <Trivia {...this.props} player={me} />}
                                        {me && !isBattling(battleTurn, me) && triviaCategory && <BlankCard {...this.props} />}
                                        {me && prompt && !triviaCategory && <Event {...this.props} player={me} host={true} />}
                                        {me && <Monster {...this.props} player={me} host={true} />}
                                    </CardContainer>
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
