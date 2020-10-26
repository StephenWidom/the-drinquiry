import React, { useEffect, useState } from 'react';
import { InputGroup, Button, Alert, Text } from '@blueprintjs/core';

import Heading from './Heading';

const Join = props => {

    const [error, setError] = useState(null);

    useEffect(() => {
        const form = document.querySelector('form');
        if (localStorage.getItem('playerName')) {
            form.name.value = localStorage.playerName;
        } else {
            form.name.focus();
        }
        const { socket } = props;
        socket.on('joinError', error => setError(error));
    }, []);

    const makeUppercase = e => {
        const field = e.target;
        const uppercaseValue = field.value.toUpperCase();
        field.value = uppercaseValue;
    }

    const handleForm = e => {
        e.preventDefault();
        
        const { name } = e.target;
        if (name.value.trim() === '') {
            setError('Please enter a name');
            return;
        }

        if (name.value.trim().length > 12) {
            setError('Fewer than 13 characters please.');
            return;
        }

        const { socket } = props;
        localStorage.setItem('playerName', name.value.trim().toUpperCase());
        socket.emit('joinSocketRoom', false, name.value.trim().toUpperCase());
    }

    return <div className='Join'>
        <div className='container'>
            <Heading />
            <h2>Join the Quest!</h2>
            <form onSubmit={e => handleForm(e)}>
                <InputGroup
                    type="text"
                    maxLength={12}
                    name="name"
                    onChange={e => makeUppercase(e)}
                    leftIcon='new-person'
                    placeholder="Name"
                    large={true}
                />
                <Button
                    large={true}
                    fill={true}
                    text="Join"
                    type="submit"
                    className='bp3-intent-success'
                />
            </form>
            <Alert
                isOpen={!!error}
                onClose={() => { setError(null); document.querySelector('form').name.focus();}}
                canEscapeKeyCancel={true}
                canOutsideClickCancel={true}
                icon='error'
            >
                <Text>{error}</Text>
            </Alert>
        </div>
    </div>;
};

export default Join;
