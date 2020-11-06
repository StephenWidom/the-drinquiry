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
import Instructions from './Instructions';
import { isInGame, getPlayer, isActive, isBattling } from '../utils';

export default class Play extends PureComponent {

    render() {
        const { socket, players, winner, started, battle, active, prompt, monster, challenge, event, disconnected, city, health, triviaCategory, battleTurn } = this.props;
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
                                            : <BlankCard />
                                        : city
                                            ? isBattling(battleTurn, me) || battleTurn === null
                                                ? <Roker player={me} host={false} {...this.props} />
                                                : <BlankCard />
                                            : <Event {...this.props} player={me} host={false} />
                                    }
                                    {prompt && me.scroll && !battle && challenge === 'category' && !!health && <ScrollButton {...this.props} />}
                                    <Monster {...this.props} player={me} host={false} />
                                </CardContainer>
                                <MobileCardContainer>
                                    {prompt && me.scroll && !battle && challenge === 'category' && !!health && <ScrollButton {...this.props} />}
                                    {!battle && event && !monster && !prompt && <Event {...this.props} player={me} host={false} />}
                                    {monster && !battle && <Monster {...this.props} player={me} host={false} />}
                                    {monster && battle && prompt && <Event {...this.props} player={me} host={false} />}
                                    {triviaCategory && (isBattling(battleTurn, me)
                                            ? <Trivia {...this.props} player={me} host={false} />
                                            : battle && <BlankCard />)
                                    }
                                    {city && (isBattling(battleTurn, me)
                                            ? <Roker {...this.props} host={false} player={me} />
                                            : battle && <BlankCard />)
                                    }
                                </MobileCardContainer>
                            </>
                            : battle // Not active player, show cards, but don't run code
                                ? <>
                                    <BattleInterface player={me} {...this.props} />
                                    <CardContainer>
                                        {triviaCategory
                                            ? isBattling(battleTurn, me) || battleTurn === null
                                                ? <Trivia {...this.props} player={me} />
                                                : <BlankCard />
                                            : city
                                                ? isBattling(battleTurn, me) || battleTurn === null
                                                    ? <Roker player={me} host={false} {...this.props} />
                                                    : <BlankCard />
                                                : <Event {...this.props} player={me} host={false} />
                                        }
                                        {prompt && me.scroll && !battle && challenge === 'category' && !!health && <ScrollButton {...this.props} />}
                                        <Monster {...this.props} player={me} host={false} />
                                    </CardContainer>
                                    <MobileCardContainer>
                                        {prompt && me.scroll && !battle && challenge === 'category' && !!health && <ScrollButton {...this.props} />}
                                        {!battle && event && !monster && !prompt && <Event {...this.props} player={me} host={false} />}
                                        {monster && !battle && <Monster {...this.props} player={me} host={false} />}
                                        {monster && battle && prompt && <Event {...this.props} player={me} host={false} />}
                                        {triviaCategory && (isBattling(battleTurn, me)
                                                ? <Trivia {...this.props} player={me} host={false} />
                                                : battle && <BlankCard />)
                                        }
                                        {city && (isBattling(battleTurn, me)
                                                ? <Roker {...this.props} host={false} player={me} />
                                                : battle && <BlankCard />)
                                        }
                                    </MobileCardContainer>
                                </>
                                : started
                                    ? me.dead
                                        ? <h2>Ya done, son. Or are you?</h2>
                                        : <h2>Awaiting the battle...</h2>
                                    : <Instructions />
                        }
                    </>
                }
            </div>
        </div>;
    }
}
