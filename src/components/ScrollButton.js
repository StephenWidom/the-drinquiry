import React from 'react';

const ScrollButton = props => {
    const { socket } = props;
    return <div className='ScrollButton' onClick={() => socket.emit('consumeScroll')}>
        <img src={require(`../assets/scroll_yellow.png`)} alt="scroll" />
    </div>;
};

export default ScrollButton;
