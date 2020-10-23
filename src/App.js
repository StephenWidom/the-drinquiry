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
            started: false,
            event: null,
            monster: null,
            modifier: 0,
            health: null,
        };
        this.socket = socketIOClient(process.env.REACT_APP_ADDR);
    }

    componentDidMount() {
        this.socket.on('gameHosted', () => this.setState({ host: true }, () => {
            this.props.history.push('/host');
        }));

        this.socket.on('updatePlayers', players => this.setState({ players }, () => console.log(this.state)));

        this.socket.on('gameStarted', () => this.setState({ started: true }));

        this.socket.on('goToLobby', () => this.props.history.push('/play'));

        this.socket.on('updateEvent', event => this.setState({ event }, () => console.log(this.state)));

        this.socket.on('updateMonster', monster => this.setState({ monster }, () => console.log(this.state)));
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
