import React from 'react';
import { useSpring, animated, config } from 'react-spring';

const Prompt = props => {
    const { prompt, challenge } = props;
    const styles = useSpring({
        config: config.wobbly,
        opacity: 1,
        from: {
            opacity: 0
        },
        delay: 2000,
    });
    return <animated.div className='Prompt' style={styles}>
        <h3>{challenge}</h3>
        <img className='placeholder' src={require('../assets/error.png')} alt='' />
        <h3>{prompt}</h3>
    </animated.div>;
};

export default Prompt;
