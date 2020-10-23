import React from 'react';
import { useSpring, animated, config } from 'react-spring';

const BattleMessage = props => {
    const { challenge, health } = props;
    const styles = useSpring({
        config: config.wobbly,
        to: [
            {
                fontSize: 90
            },
            {
                fontSize: 40
            }
        ],
        from: {
            fontSize: 20
        },
    });

    return <div className='BattleMessage'>
        <animated.h1 style={styles}>
            {!!health
                ? <>{challenge} battle</>
                : <div className='nice'>Caught him square! Well done!</div>
            }
        </animated.h1>
    </div>;
};

export default BattleMessage;
