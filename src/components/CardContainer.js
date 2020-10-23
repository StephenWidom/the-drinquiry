import React from 'react';

const CardContainer = props => {
    return <div className='CardContainer'>
        {props.children}
    </div>;
};

export default CardContainer;
