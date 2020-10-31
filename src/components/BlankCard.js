import React from 'react';

const BlankCard = props => {
    return <div className='BlankCard'>
        <div className='card back'>
            <h3>The DRINQUIRY</h3>
            <img src={require('../assets/chain_mail_3.png')} alt='' className='placeholder' />
            <h3>Awaiting Trivia</h3>
        </div>
    </div>
};

export default BlankCard;
