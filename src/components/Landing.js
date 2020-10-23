import React from 'react';
import { Button } from '@blueprintjs/core';
import { Link } from 'react-router-dom';

import Heading from './Heading';

const Landing = props => {
    const hostGame = () => {
        const { socket } = props;
        socket.emit('joinSocketRoom', true, null);
    }

    return <div className='Landing'>
        <div className='container'>
            <Heading />
            <Link
                to='/join'
                className='bp3-button bp3-large bp3-fill bp3-intent-primary'
            >Join</Link>
            <Button
                text='Host'
                large={true}
                onClick={hostGame}
                fill={true}
            />
        </div>
    </div>;
};

export default Landing;
