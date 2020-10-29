import React from 'react';
import { useSpring, animated } from 'react-spring';

const BlackBackground = props => {
    const { battle } = props;
    const styles = useSpring({
        opacity: battle ? 0.7 : 0,
        from: {
            opacity: 0
        }
    });
    return <animated.div className='BlackBackground' style={styles}></animated.div>;
};

export default BlackBackground;
