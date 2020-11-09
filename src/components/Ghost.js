import React from 'react';
import { useSpring, animated, config } from 'react-spring';

const Ghost = props => {
    const styles = useSpring({
        config: config.wobbly,
        opacity: 1,
        transform: 'scale(1.2)',
        from: {
            opacity: 0,
            transform: 'scale(1)',
        }
    });
    return <div className='Ghost'>
        <animated.img src={require('../assets/ghost.png')} alt='ghost' style={styles} />
    </div>;
};

export default Ghost;
