import React, { useEffect } from 'react';

const Event = props => {
    const { event, socket, player } = props;
    useEffect(() => {
        if (!player || !event)
            return;

        console.log('EVALING');

        if (event.code)
            eval(event.code);
    }, [event]);

    const handleEventClick = () => {
        if (!event)
            socket.emit('drawEvent');
    }

    return <div className='Event' onClick={handleEventClick}>
        {event
            ? <>
                <h3>{event.name}</h3>
                <img src={require(`../assets/${event.src}.png`)} alt='' />
                <p>{event.text}</p>
            </>
            : <>
                <img className='placeholder' src={require('../assets/polymorph_other.png')} alt='' />
                <h6>Event</h6>
            </>
        }
    </div>;
};

export default Event;
