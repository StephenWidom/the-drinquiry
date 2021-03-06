import React, { PureComponent } from 'react';
import { useSpring, animated } from 'react-spring';

export default class Timer extends PureComponent {
    componentDidMount() {
        const { socket, host } = this.props;
        this.missTimer = setTimeout(() => {
            if (!host)
                socket.emit('missAttack');
        }, 37000);
    }

    componentWillUnmount() {
        clearTimeout(this.missTimer);
    }

    render() {
        const { host, isActive, haunted } = this.props;
        return <div className='Timer'>
            {!haunted && <>
                <Top />
                <Left host={host} isActive={isActive} />
                <Bottom />
                <Right host={host} isActive={isActive} />
            </>}
        </div>;
    }

};

const Top = React.memo(props => {
    const topStyles = useSpring({
        width: 0,
        from: {
            width: 260
        },
        config: {
            duration: 10000,
        }
    });
    return <animated.div className='top' style={topStyles}></animated.div>;
});

const Left = React.memo(props => {
    const { host, isActive } = props;
    const leftStyles = useSpring({
        height: 0,
        from: {
            height: host && !isActive ? 95 : 217,
        },
        config: {
            duration: 8000,
        },
        delay: 10000,
    });
    return <animated.div className='left' style={leftStyles}></animated.div>;
});

const Bottom = React.memo(props => {
    const bottomStyles = useSpring({
        width: 0,
        from: {
            width: 260
        },
        config: {
            duration: 10000,
        },
        delay: 18000,
    });
    return <animated.div className='bottom' style={bottomStyles}></animated.div>;
});

const Right = React.memo(props => {
    const { host, isActive } = props;
    const rightStyles = useSpring({
        height: 0,
        from: {
            height: host && !isActive ? 95 : 217,
        },
        config: {
            duration: 8000,
        },
        delay: 28000,
    });
    return <animated.div className='right'style={rightStyles}></animated.div>;
});
