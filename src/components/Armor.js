import React from 'react';

const Armor = props => {
    const { player, socket } = props;
    return <div className='Armor' onClick={() => socket.emit('updateItem', 'armor', player.id)}>
        {player.armor && <img src={require('../assets/chain_mail_3.png')} alt='armor' />}
    </div>;
};

export default Armor;
