import React from 'react';
import { useSpring, animated } from 'react-spring';

const Trivia = props => {
    const { triviaAnswer } = props;
    return <div className='Trivia'>
        <TriviaBack {...props} />
        {triviaAnswer && <TriviaFront {...props} />}
    </div>;
};

const TriviaBack = props => {
    const { triviaCategory, triviaAnswer, prompt, socket } = props;
    const styles = useSpring({
        transform: triviaAnswer ? 'rotateY(90deg)' : 'rotateY(0deg)',
        from: {
            transform: 'rotateY(0deg)',
        }
    });
    return <animated.div className='TriviaBack card' style={styles} onClick={() => socket.emit('revealAnswer')}>
        <h3>Trivia</h3>
        <h3 className='question'>{prompt}</h3>
        <h3 className='category'>{triviaCategory}</h3>
    </animated.div>;
};

const TriviaFront = props => {
    const { triviaAnswer } = props;
    const styles = useSpring({
        transform: triviaAnswer ? 'rotateY(0deg)' : 'rotateY(90deg)',
        from: {
            transform: 'rotateY(90deg)',
        }
    });
    return <div className='TriviaFront card' style={styles}>
        <h3>Answer</h3>
        <img className='placeholder' src={require('../assets/error.png')} alt='' />
        <h3 className='answer'>{triviaAnswer}</h3>
    </div>;
}

export default Trivia;
