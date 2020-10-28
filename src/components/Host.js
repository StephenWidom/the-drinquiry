import React from 'react';
import { Redirect } from 'react-router-dom';

import Game from './Game';
import Wait from './Wait';
import Winner from './Winner';

const Host = props => {
    const { host, started, winner } = props;
    return <div className='Host'>
        {!host && <Redirect to='/' />}
        <div className='container'>
            {started
                ? <Game {...props} />
                : winner
                    ? <Winner {...props} />
                    : <Wait {...props} />
            }
        </div>
    </div>;
};

export default Host;
