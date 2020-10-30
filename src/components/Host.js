import React from 'react';
import { Redirect } from 'react-router-dom';

import Game from './Game';
import Wait from './Wait';
import Winner from './Winner';
import Audio from './Audio';

const Host = props => {
    const { host, started, winner } = props;

    return <div className='Host'>
        {!host && <Redirect to='/' />}
        <Audio {...props} />
        <div className='container'>
            {started
                ? <Game {...props} />
                : winner
                    ? <Winner {...props} host={true} />
                    : <Wait {...props} />
            }
        </div>
    </div>;
};

export default Host;
