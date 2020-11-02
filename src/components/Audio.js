import React, { PureComponent } from 'react';
import ReactHowler from 'react-howler';
import { Icon } from '@blueprintjs/core';

import { getBattlingPlayer } from '../utils';

export default class Audio extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            volume: 1,
            waitMusic: true,
            doorSound: false,
            hitSound: null,
            hitSoundPlaying: false,
            potionSound: false,
            missSound: false,
            scrollSound: false,
            battleStart: false,
            battleMusic: false,
            monsterDeathSound: false,
            playerDeathSound: null,
            playerDeathSoundPlaying: false,
            cheer: false,
        };
        this.volumes = [0, 1, 0.5];
    }

    componentDidMount() {
        const { socket } = this.props;
        socket.on('playWaitMusic', () => this.setState({ waitMusic: true }));
        socket.on('playDoorSound', () => this.setState({ doorSound: true }));
        socket.on('playHitSound', (id, players) => {
            const battlingPlayer = getBattlingPlayer(id, players);
            this.setState({ hitSound: require(`../assets/audio/${battlingPlayer.character.audio.hit}.mp3`), hitSoundPlaying: true });
        });
        socket.on('playPotionSound', () => this.setState({ potionSound: true }));
        socket.on('playMissSound', () => this.setState({ missSound: true }));
        socket.on('playScrollSound', () => this.setState({ scrollSound: true }));
        socket.on('playBattleMusic', () => this.setState({ battleStart: true, battleMusic: true, waitMusic: false }));
        socket.on('playMonsterDeathSound', () => this.setState({ monsterDeathSound: true }));
        socket.on('playerDeathSound', player => this.setState({ playerDeathSound: require(`../assets/audio/${player.character.audio.death}.mp3`), playerDeathSoundPlaying: true }));
        socket.on('gameWon', winner => {
            if (winner !== null)
                this.setState({ cheer: true, waitMusic: false });
        });
    }

    componentDidUpdate(prevProps) {
        const { battle } = this.props;
        if (prevProps.battle && !battle)
            this.setState({ battleMusic: false, waitMusic: true });
    }

    updateVolume = () => {
        let newVolumeIndex = this.state.volume + 1;
        if (newVolumeIndex > this.volumes.length - 1)
            newVolumeIndex = 0;
        this.setState({ volume: newVolumeIndex }, () => {
            window.Howler.volume(this.volumes[this.state.volume]);
        });
    };

    render() {
        const { volume, waitMusic, doorSound, hitSound, hitSoundPlaying, potionSound, missSound, scrollSound, battleStart, battleMusic, monsterDeathSound, cheer, playerDeathSound, playerDeathSoundPlaying } = this.state;
        const { monster, battle } = this.props;
        return <div className='Audio'>
            <Icon
                onClick={this.updateVolume}
                icon={volume === 1 ? 'volume-up' : volume === 2 ? 'volume-down' : 'volume-off'}
                iconSize={30}
            />
            <ReactHowler
                src={require('../assets/audio/wait.mp3')}
                volume={0.6}
                playing={waitMusic}
                loop={true}
            />
            <ReactHowler
                src={require('../assets/audio/door.mp3')}
                volume={0.8}
                playing={doorSound}
                onEnd={() => this.setState({ doorSound: false })}
            />
            {battle && hitSound &&
            <ReactHowler
                src={hitSound}
                volume={0.8}
                playing={hitSoundPlaying}
                onEnd={() => this.setState({ hitSoundPlaying: false })}
            />
            }
            <ReactHowler
                src={require('../assets/audio/potion.mp3')}
                volume={0.8}
                playing={potionSound}
                onEnd={() => this.setState({ potionSound: false })}
            />
            <ReactHowler
                src={require('../assets/audio/miss.mp3')}
                volume={0.8}
                playing={missSound}
                onEnd={() => this.setState({ missSound: false })}
            />
            <ReactHowler
                src={require('../assets/audio/scroll.mp3')}
                volume={0.8}
                playing={scrollSound}
                onEnd={() => this.setState({ scrollSound: false })}
            />
            <ReactHowler
                src={require('../assets/audio/battle_start.mp3')}
                playing={battleStart}
                volume={0.6}
                onEnd={() => this.setState({ battleStart: false })}
            />
            <ReactHowler
                src={monster && monster.src === 'kratos_on_acid' ? require('../assets/audio/kratos.mp3') : require('../assets/audio/battle.mp3')}
                playing={battleMusic}
                volume={0.4}
                loop={true}
            />
            <ReactHowler
                src={require('../assets/audio/monster_death.mp3')}
                volume={0.8}
                playing={monsterDeathSound}
                onEnd={() => this.setState({ monsterDeathSound: false })}
            />
            {playerDeathSound &&
            <ReactHowler
                src={playerDeathSound}
                volume={0.8}
                playing={playerDeathSoundPlaying}
                onEnd={() => this.setState({ playerDeathSoundPlaying: false })}
            />
            }
            <ReactHowler
                src={require('../assets/audio/victory.mp3')}
                playing={cheer}
                volume={0.5}
                onEnd={() => this.setState({ cheer: false })}
            />
        </div>;
    }
}
