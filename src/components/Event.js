import React, { useState } from 'react';

const Event = props => {
    const { event, socket, player } = props;
    const [done, setDone] = useState(false);

    const doCard = () => {
        // Host cannot click the bish
        if (!player)
            return;

        if (event.code && !done)
            eval(event.code);

        setDone(true);
    }

    return <div className={`Event ${done ? '' : 'clickme'}`} onClick={doCard}>
        <h3>{event.name}</h3>
        <p>{event.text}</p>
        <img src={require(`../assets/${event.src}.png`)} alt='' />
    </div>;
};

export default Event;
