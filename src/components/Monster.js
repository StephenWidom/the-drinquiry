import React from 'react';

const Monster = props => {
    const { monster } = props;
    return <div className='Monster'>
        <h3>{monster.name}</h3>
        <p>{monster.text}</p>
        <img src={require(`../assets/${monster.src}.png`)} alt='' />
    </div>;
};

export default Monster;
