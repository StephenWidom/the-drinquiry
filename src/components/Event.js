import React, { PureComponent } from 'react';
import { useSpring, animated } from 'react-spring';

export default class Event extends PureComponent {
    componentDidUpdate(prevProps) {
        const { event, player, socket, host } = this.props;
        if (!player)
            return;

        // Don't execute card code for host
        if (host)
            return;

        if (!!event && prevProps.event !== event) {
            if (event.code) {
                setTimeout(() => {
                    eval(event.code);
                }, 1800);
            }
        }
    }

    handleEventClick = () => {
        const { event, socket, player } = this.props;
        if (!event)
            socket.emit('drawEvent', player);
    }

    render() {
        const { event } = this.props;
        return <div className='Event' onClick={this.handleEventClick}>
            <EventBack event={event} />
            {event && <EventFront event={event} />}
            {prompt && <Prompt {...this.props} />}
        </div>;
    }

}

const EventBack = props => {
    const { event } = props;
    const styles = useSpring({
        transform: event ? 'rotateY(90deg)' : 'rotateY(0deg)',
        from: {
            transform: 'rotateY(0deg)',
        }
    });
    return <animated.div className='EventBack card back' style={styles}>
        <img className='placeholder' src={require('../assets/polymorph_other.png')} alt='' />
        <h6>Event</h6>
    </animated.div>;
}

const EventFront = props => {
    const { event } = props;
    const styles = useSpring({
        transform: event ? 'rotateY(0deg)' : 'rotateY(90deg)',
        from: {
            transform: 'rotateY(90deg)',
        },
    });
    return <animated.div className='EventFront card' style={styles}>
        <h3>{event.name}</h3>
        <img src={require(`../assets/${event.src}.png`)} alt='' />
        <p>{event.text}</p>
    </animated.div>;
}

const Prompt = props => {
    const { prompt, challenge } = props;
    const styles = useSpring({
        transform: prompt ? 'rotateY(0deg)' : 'rotateY(90deg)',
        from: {
            transform: 'rotateY(90deg)',
        },
    });
    return <animated.div className='Prompt card' style={styles}>
        <h3>{challenge}</h3>
        <img className='placeholder' src={require('../assets/error.png')} alt='' />
        <h3>{prompt}</h3>
    </animated.div>;
};

