import React from 'react';
import { Link } from 'react-router-dom';

import Heading from './Heading';

const Disconnected = props => {
    return <div className='Disconnected'>
        <Heading />
        <h2>You have disconnected.</h2>
        <h4>Refresh to rejoin the bish</h4>
    </div>;
};

export default Disconnected;
