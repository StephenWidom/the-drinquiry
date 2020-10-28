import React from 'react';

const Scroll = props => {
    const { player, socket } = props;
    return <div className='Scroll' onClick={() => socket.emit('updateItem', player.id, 'scroll', true)}>
        {player.scroll && <img src={require('../assets/scroll_yellow.png')} alt='scroll' />}
    </div>;
};

export default Scroll;
