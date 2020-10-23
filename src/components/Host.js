import React from 'react';
import { Redirect } from 'react-router-dom';

import Game from './Game';
import Wait from './Wait';

const Host = props => {
    const { host, started } = props;
    return <div className='Host'>
        {!host && <Redirect to='/' />}
        <div className='container'>
            {started
                ? <Game {...props} />
                : <Wait {...props} />
            }
        </div>
    </div>;
};

export default Host;
