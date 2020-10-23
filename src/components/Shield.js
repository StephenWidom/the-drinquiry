import React from 'react';

const Shield = props => {
    const { player, socket } = props;
    return <div className='Shield' onClick={() => socket.emit('updateItem', 'shield', player.id)}>
        {player.shield && <img src={require('../assets/large_shield_1_new.png')} alt='shield' />}
    </div>;
};

export default Shield;
