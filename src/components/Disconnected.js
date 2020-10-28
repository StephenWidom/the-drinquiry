import React from 'react';

import Heading from './Heading';

const Disconnected = props => {
    return <div className='Disconnected'>
        <Heading />
        <h2>You have disconnected.</h2>
        <h4>Refresh to rejoin the bish</h4>
    </div>;
};

export default Disconnected;
