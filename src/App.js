import React, { PureComponent } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import socketIOClient from 'socket.io-client';

import Join from './components/Join';
import Landing from './components/Landing';
import Host from './components/Host';
import Play from './components/Play';
import BlackBackground from './components/BlackBackground';

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
            city: null,
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

        this.socket.on('gameStarted', started => this.setState({ started }));

        this.socket.on('goToLobby', () => this.props.history.push('/play'));

        this.socket.on('updateEvent', event => this.setState({ event }, () => console.log(this.state)));

        this.socket.on('updateMonster', monster => this.setState({ monster }, () => console.log(this.state)));

        this.socket.on('updateMonsterHealth', health => this.setState({ health }, () => console.log(this.state)));

        this.socket.on('updateBattle', (battle, id) => this.setState({ battle, battleTurn: id }, () => console.log(this.state)));

        this.socket.on('updateGame', (health, event, monster, active, battleTurn, battle, modifier, prompt, challenge, triviaAnswer, triviaCategory, city, temperature = null) => this.setState({ health, event, monster, active, battleTurn, battle, modifier, prompt, challenge, triviaAnswer, triviaCategory, city, temperature }, () => console.log(this.state)));

        this.socket.on('updatePrompt', (prompt, challenge, triviaCategory, city = null, temperature = null, triviaAnswer = false) => this.setState({ prompt, challenge, triviaCategory, city, temperature, triviaAnswer }, () => console.log(this.state)));

        this.socket.on('updateCity', city => this.setState({ city }, () => console.log(this.state)));

        this.socket.on('bootPlayer', () => {
            this.setState({ disconnected: true }, () => this.socket.disconnect(true));
        });

        this.socket.on('revealAnswer', triviaAnswer => this.setState({ triviaAnswer }));

        this.socket.on('setTemp', temperature => this.setState({ temperature }));

        this.socket.on('gameWon', player => this.setState({ winner: player, started: false }));
    }

    render() {
        return <div className='App'>
            <BlackBackground {...this.state} />
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
