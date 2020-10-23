import React from 'react';

const Book = props => {
    const { player, socket } = props;
    return <div className='Book' onClick={() => socket.emit('updateItem', 'book', player.id)}>
        {player.book && <img src={require('../assets/dark_blue_new.png')} alt='book' />}
    </div>;
};

export default Book;
