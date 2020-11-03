import React from 'react';

const Instructions = props => {
    return <div className='Instructions'>
        <h2>Guide</h2>
        <div className='whitebg'>
            <h3>On your turn:</h3>
            <p>1. Draw an event.</p>
            <p>2. Draw a monster. Each monster will present a challenge.</p>
            <p><strong>Challenges:</strong> sentence, category, rhyme, trivia, roker.</p>
            <p>3. If the challenge is <strong>category</strong>, you may use <img src={require('../assets/scroll_yellow.png')} alt='scroll' /> to switch categories.</p>
            <p>4. Click/Press the monster to begin the battle.</p>
        </div>
        <div className='whitebg'>
            <h3>During battle:</h3>
            <p>Click <img src={require('../assets/unseen_weapon_new.png')} alt='' /> if you answered correctly. This will decrease the monster's health by one and pass the battle turn to the next player.</p>
            <p>Click <img src={require('../assets/cyan_new.png')} alt='potion' /> to skip your turn. The monster's health will remain unaffected, but the turn will be passed to the next player.</p>
            <p>Click <img src={require('../assets/sensed_monster_nasty.png')} alt='' /> if you answered incorrectly. You will lose one heart and the battle will be over.</p>
        </div>
        <div className='whitebg'>
            <h3>Helpful info</h3>
            <p>If you made a mistake and clicked <img src={require('../assets/unseen_weapon_new.png')} alt='' /> when you actually got the prompt wrong, long press/hold <img src={require('../assets/sensed_monster_nasty.png')} alt='' /> to correct.</p>
            <p>If a trivia question cannot be answered (because it references a non-existant visual clue or the text is illegible), long press/hold the trivia card to generate a new question.</p>
        </div>
    </div>;
};

export default Instructions;
