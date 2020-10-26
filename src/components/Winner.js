import React from 'react';
import { useSpring, animated, config } from 'react-spring';

const Winner = props => {
    const { winner } = props;
    const styles = useSpring({
        config: config.wobbly,
        to: [
            {
                transform: 'rotateY(180deg)',
                width: 256,
            },
            {
                transform: 'rotateY(0deg)',
                width: 128,
            }
        ],
        from: {
            width: 64
        }
    });

    return <div className='Winner'>
        <h1>{winner.name} <span>wins!</span></h1>
        <animated.img style={styles} src={require(`../assets/${winner.character}.png`)} alt='' />
    </div>;
};

export default Winner;
