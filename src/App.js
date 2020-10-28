import React, { PureComponent } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import socketIOClient from 'socket.io-client';

import Join from './components/Join';
import Landing from './components/Landing';
import Host from './components/Host';
import Play from './components/Play';

import './App.scss';

class App extends PureComponent {
    constructor() {
        super();
        this.state = {
            host: false,
            joinError: null,
            players: [],
            active: null,
            battleTurn: null,
            started: false,
            event: null,
            monster: null,
            modifier: 0,
            health: null,
            battle: false,
            prompt: null,
            challenge: null,
            disconnected: false,
            suddenDeath: false,
            winner: null,
            triviaAnswer: null,
            triviaCategory: null,
        };
        this.socket = socketIOClient(process.env.REACT_APP_ADDR);
    }

    componentDidMount() {
        this.socket.on('gameHosted', () => this.setState({ host: true }, () => {
            this.props.history.push('/host');
        }));

        this.socket.on('updatePlayers', players => this.setState({ players }, () => console.log(this.state)));

        this.socket.on('updateActivePlayer', id => this.setState({ active: id }));

        this.socket.on('gameStarted', () => this.setState({ started: true }));

        this.socket.on('goToLobby', () => this.props.history.push('/play'));

        this.socket.on('updateEvent', event => this.setState({ event }, () => console.log(this.state)));

        this.socket.on('updateMonster', monster => this.setState({ monster }, () => console.log(this.state)));

        this.socket.on('updateMonsterHealth', health => this.setState({ health }, () => console.log(this.state)));

        this.socket.on('updateBattle', (battle, id) => this.setState({ battle, battleTurn: id }, () => console.log(this.state)));

        this.socket.on('updateGame', (health, event, monster, active, battleTurn, battle, modifier, prompt, challenge, triviaAnswer, triviaCategory) => this.setState({ health, event, monster, active, battleTurn, battle, modifier, prompt, challenge, triviaAnswer, triviaCategory }, () => console.log(this.state)));

        this.socket.on('updatePrompt', (prompt, challenge, triviaCategory, triviaAnswer = null) => this.setState({ prompt, challenge, triviaCategory, triviaAnswer }, () => console.log(this.state)));

        this.socket.on('bootPlayer', () => {
            this.setState({ disconnected: true }, () => this.socket.disconnect(true));
        });

        this.socket.on('revealAnswer', triviaAnswer => this.setState({ triviaAnswer }));

        this.socket.on('gameWon', player => this.setState({ winner: player, started: false }));
    }

    render() {
        return <div className='App'>
            <Switch>
                <Route path='/join'>
                    <Join {...this.state} socket={this.socket} />
                </Route>
                <Route path='/host'>
                    <Host {...this.state} socket={this.socket} />
                </Route>
                <Route path='/play'>
                    <Play {...this.state} socket={this.socket} />
                </Route>
                <Route path='/'>
                    <Landing {...this.state} socket={this.socket} />
                </Route>
            </Switch>
        </div>;
    }
}

export default withRouter(App);
