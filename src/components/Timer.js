import React, { useEffect } from 'react';
import { useSpring, animated } from 'react-spring';

const Timer = props => {
    useEffect(() => {
        const { socket, host } = props;
        const missTimer = setTimeout(() => {
            if (!host)
                socket.emit('missAttack');
        }, 36000);

        return () => {
            clearTimeout(missTimer);
        }
    }, []);

    const topStyles = useSpring({
        width: 0,
        from: {
            width: 260
        },
        config: {
            duration: 10000,
        }
    });

    const leftStyles = useSpring({
        height: 0,
        from: {
            height: 217
        },
        config: {
            duration: 8000,
        },
        delay: 10000,
    });

    const bottomStyles = useSpring({
        width: 0,
        from: {
            width: 260
        },
        config: {
            duration: 10000,
        },
        delay: 18000,
    });

    const rightStyles = useSpring({
        height: 0,
        from: {
            height: 217,
        },
        config: {
            duration: 8000,
        },
        delay: 28000,
    });

    return <div className='Timer'>
        <animated.div className='top' style={topStyles}></animated.div>
        <animated.div className='left' style={leftStyles}></animated.div>
        <animated.div className='bottom' style={bottomStyles}></animated.div>
        <animated.div className='right'style={rightStyles}></animated.div>
    </div>;
};

export default Timer;
