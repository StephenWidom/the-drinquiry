import React, { PureComponent } from 'react';
import { Redirect } from 'react-router-dom';

import Player from './Player';
import DrawButtons from './DrawButtons';
import Event from './Event';
import Monster from './Monster';
import Trivia from './Trivia';
import Roker from './Roker';
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
        const { socket, players, winner, started, battle, active, prompt, monster, event, disconnected, city, health, triviaCategory, battleTurn } = this.props;
        const me = getPlayer(socket.id, players);
        return <div className='Play'>
            {!isInGame(socket.id, players) && <Redirect to='/join' />}
            <div className='container'>
                {disconnected
                    ? <Disconnected />
                    : winner
                        ? <Winner {...this.props} host={false} />
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
                                        : city
                                            ? <Roker player={me} host={false} {...this.props} />
                                            : <Event {...this.props} player={me} host={false} />
                                    }
                                    {prompt && me.scroll && !battle && prompt === 'category' && !!health && <ScrollButton {...this.props} />}
                                    <Monster {...this.props} player={me} host={false} />
                                </CardContainer>
                                <MobileCardContainer>
                                    {prompt && me.scroll && !battle && prompt === 'category' && !!health && <ScrollButton {...this.props} />}
                                    {!battle && event && !monster && !prompt && <Event {...this.props} player={me} host={false} />}
                                    {monster && !battle && <Monster {...this.props} player={me} host={false} />}
                                    {monster && battle && prompt && <Event {...this.props} player={me} host={false} />}
                                    {triviaCategory && (isBattling(battleTurn, me)
                                            ? <Trivia {...this.props} player={me} host={false} />
                                            : battle && <BlankCard {...this.props} />)
                                    }
                                    {city && battle && <Roker {...this.props} host={false} player={me} />}
                                </MobileCardContainer>
                            </>
                            : battle // Not active player, show cards, but don't run code
                                ? <>
                                    <BattleInterface player={me} {...this.props} />
                                    <CardContainer>
                                        {triviaCategory
                                            ? isBattling(battleTurn, me) || battleTurn === null
                                                ? <Trivia {...this.props} player={me} />
                                                : <BlankCard {...this.props} />
                                            : city
                                                ? <Roker player={me} host={false} {...this.props} />
                                                : <Event {...this.props} player={me} host={false} />
                                        }
                                        {prompt && me.scroll && !battle && prompt === 'category' && !!health && <ScrollButton {...this.props} />}
                                        <Monster {...this.props} player={me} host={false} />
                                    </CardContainer>
                                    <MobileCardContainer>
                                        {prompt && me.scroll && !battle && prompt === 'category' && !!health && <ScrollButton {...this.props} />}
                                        {!battle && event && !monster && !prompt && <Event {...this.props} player={me} host={false} />}
                                        {monster && !battle && <Monster {...this.props} player={me} host={false} />}
                                        {monster && battle && prompt && <Event {...this.props} player={me} host={false} />}
                                        {triviaCategory && (isBattling(battleTurn, me)
                                                ? <Trivia {...this.props} player={me} host={false} />
                                                : battle && <BlankCard {...this.props} />)
                                        }
                                        {city && <Roker {...this.props} host={false} player={me} />}
                                    </MobileCardContainer>
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
