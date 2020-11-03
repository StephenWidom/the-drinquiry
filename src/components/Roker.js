import React from 'react';
import { useSpring, animated } from 'react-spring';
import LongPressable from 'react-longpressable';

import { isBattling } from '../utils';

const Roker = props => {
    const { temperature } = props;
    return <div className='Roker'>
        <RokerBack {...props} />
        {temperature && <RokerFront {...props} />}
    </div>;
};

const RokerBack = props => {
    const { city, temperature, socket, battle, host, battleTurn, player } = props;
    const styles = useSpring({
        transform: temperature ? 'rotateY(90deg)' : 'rotateY(0deg)',
        from: {
            transform: 'rotateY(0deg)',
        }
    });
    const revealTemperature = () => {
        if (battle && (isBattling(battleTurn, player) || host))
            socket.emit('revealTemperature');
    }
    return <LongPressable
            onShortPress={revealTemperature}
            longPressTime={2000}
        >
        <animated.div className='RokerBack card' style={styles}>
            <h3>Roker</h3>
            {city.conditions && <h3 className='conditions'>Conditions:<span>{city.conditions}</span></h3>}
            <h3 className='category'>{city.name}, {city.country}</h3>
        </animated.div>;
    </LongPressable>
}

const RokerFront = props => {
    const { temperature } = props;
    const styles = useSpring({
        transform: temperature ? 'rotateY(0deg)' : 'rotateY(90deg)',
        from: {
            transform: 'rotateY(90deg)',
        }
    });
    return <div className='RokerFront card' style={styles}>
        <h3>Answer</h3>
        <img className='placeholder' src={require('../assets/error.png')} alt='' />
        <h3 className='answer'>{Math.round(temperature, 10)}°F</h3>
    </div>;
}

export default Roker;
