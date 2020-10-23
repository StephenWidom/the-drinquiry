import React from 'react';

const Amulet = props => {
    const { player, socket } = props;
    return <div className='Amulet' onClick={() => socket.emit('updateItem', 'amulet', player.id)}>
        {player.amulet && <img src={require('../assets/urand_bloodlust_new.png')} alt='amulet' />}
    </div>;
};

export default Amulet;
