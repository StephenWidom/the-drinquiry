import React, { PureComponent } from 'react';
import { useSpring, animated } from 'react-spring';

export default class Monster extends PureComponent {
    componentDidUpdate(prevProps) {
        const { player, monster, health, socket } = this.props;

        // Don't do anything for the host
        // Prevents these from running twice
        if (!player || !monster)
            return;

        if (prevProps.monster === null && monster)
            socket.emit('initMonster', monster);

        if (prevProps.health && health === 0)
            socket.emit('defeatMonster');
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
        const { monster, health } = this.props;
        return <div className='Monster' onClick={this.handleMonsterClick}>
            <MonsterBack monster={monster} />
            {monster && <MonsterFront monster={monster} health={health} />}
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
    const { monster, health } = props;
    const styles = useSpring({
        transform: monster ? 'rotateY(0deg)' : 'rotateY(90deg)',
        filter: health ? 'invert(0%)' : 'invert(100%)',
        from: {
            transform: 'rotateY(90deg)',
            filter: 'invert(0%)',
        }
    });
    return <animated.div className='MonsterFront card' style={styles}>
        <h3>{monster.name}</h3>
        <img src={require(`../assets/${monster.src}.png`)} alt='' />
        <h5>{monster.challenge}</h5>
        <h4>{health} / {monster.health}</h4>
    </animated.div>;
};
