import React, { PureComponent } from 'react';
import _ from 'lodash';
import ReactHowler from 'react-howler';
import { useSpring, animated } from 'react-spring';

export default class Monster extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            playing: false,
            monsterDeath: false,
            roar: this.getRandomRoar(),
            roarPlaying: false,
        };
    }
    componentDidUpdate(prevProps) {
        const { player, monster, health, socket, host, battle } = this.props;

        if (!prevProps.battle && battle && host)
            this.setState({ playing: true });

        if (prevProps.battle && !battle && host)
            this.setState({ playing: false });

        if (prevProps.health && health === 0) {
            if (host) {
                this.setState({ monsterDeath: true });
            } else {
                socket.emit('defeatMonster');
            }
        }

        if (prevProps.monster === null && monster) {
            if (host) {
                this.setState({ roar: this.getRandomRoar(), roarPlaying: true });
            } else {
                socket.emit('initMonster', monster);
            }
        }
    }

    componentWillUnmount() {
        if (this.props.host)
            this.setState({ playing: false });
    }

    getRandomRoar = () => {
        const randInt = _.random(0, 3);
        return `roar${randInt}.mp3`;
    }

    handleMonsterClick = () => {
        const { event, monster, socket } = this.props;
        // Can't draw a monster before an event
        if (!event)
            return;

        if (!monster) {
            socket.emit('drawMonster');
        } else {
            socket.emit('battleMonster', monster.challenge);
        }
    }

    render() {
        const { monster, health, battle, host } = this.props;
        const { playing, monsterDeath, roar, roarPlaying } = this.state;
        return <div className='Monster' onClick={this.handleMonsterClick}>
            {host && <>
                <ReactHowler
                    src={require(`../assets/audio/${roar}`)}
                    playing={roarPlaying}
                    volume={0.7}
                    onEnd={() => this.setState({ roarPlaying: false })}
                />
            </>}
            <MonsterBack monster={monster} />
            {monster && <MonsterFront monster={monster} health={health} battle={battle} />}
        </div>;
    }
};

const MonsterBack = props => {
    const { monster } = props;
    const styles = useSpring({
        transform: monster ? 'rotateY(90deg)' : 'rotateY(0deg)',
        from: {
            transform: 'rotateY(0deg)',
        }
    });
    return <animated.div className='MonsterBack card back' style={styles}>
        <img className='placeholder' src={require('../assets/fire_breath.png')} alt='' />
        <h6>Monster</h6>
    </animated.div>;
};

const MonsterFront = props => {
    const { monster, health, battle } = props;
    const styles = useSpring({
        transform: monster ? 'rotateY(0deg)' : 'rotateY(90deg)',
        filter: health ? 'invert(0%)' : 'invert(100%)',
        borderColor: battle ? '#fff' : '#EC4C70',
        from: {
            transform: 'rotateY(90deg)',
            filter: 'invert(0%)',
            borderColor: '#fff',
        }
    });
    return <animated.div className='MonsterFront card' style={styles}>
        <h3>{monster.name}</h3>
        <img src={require(`../assets/${monster.src}.png`)} alt='' />
        <h5>{monster.challenge}</h5>
        <h4>{health} / {monster.health}</h4>
    </animated.div>;
};
