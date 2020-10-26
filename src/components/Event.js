import React, { PureComponent } from 'react';

export default class Event extends PureComponent {

    componentDidUpdate(prevProps) {
        const { event, player, socket } = this.props;
        // Don't execute card code for host
        if (!player)
            return;

        if (!!event && prevProps.event !== event) {
            if (event.code) {
                setTimeout(() => {
                    eval(event.code);
                }, 1000);
            }
        }
    }

    handleEventClick = () => {
        const { event, socket } = this.props;
        if (!event)
            socket.emit('drawEvent');
    }

    render() {
        const { event } = this.props;
        return <div className='Event' onClick={this.handleEventClick}>
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
    }

}
