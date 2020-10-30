import React from 'react';
import { Button } from '@blueprintjs/core';
import { useSpring, animated, config } from 'react-spring';

const Winner = props => {
    const { winner, host } = props;
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
        {Array.isArray(winner) // Unlikely
            ? <>
                <h1>{winner[0].name} and {winner[1].name} <span>win!!</span></h1>
                <animated.img style={styles} src={require(`../assets/${winner[0].character}.png`)} alt='' />
                <animated.img style={styles} src={require(`../assets/${winner[1].character}.png`)} alt='' />
            </>
            : <>
                <h1>{winner.name} <span>wins!</span></h1>
                <animated.img style={styles} src={require(`../assets/${winner.character}.png`)} alt='' />
            </>
        }

        {host && <RestartButton {...props} />}
    </div>;
};

const RestartButton = props => {
    const { socket } = props;
    const styles = useSpring({
        delay: 3000,
        opacity: 1,
        from: {
            opacity: 0
        },
    });
    return <animated.div style={styles} className='RestartButton'>
        <Button
            text='Fuck that noise! Go again!'
            large={true}
            fill={true}
            className='bp3-intent-success'
            onClick={() => socket.emit('runItBack')}
        />
    </animated.div>;
};

export default Winner;
