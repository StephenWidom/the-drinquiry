module.exports = [
    {
        name: 'Treant',
        health: 10,
        challenge: 'category',
        reward: 'none',
        src: 'treant',
    },
    {
        name: 'Abomination',
        health: 15,
        challenge: 'category',
        reward: '+1 life',
        src: 'abomination_large_2',
        code: `socket.emit('updateHealth', player.id, 1);`,
    },
    {
        name: 'Draconic',
        health: 18,
        challenge: 'category',
        reward: 'make a rule',
        src: 'draconic_base-black_new',
    },
    {
        name: 'Efreet',
        health: 10,
        challenge: 'sentence',
        reward: 'none',
        src: 'efreet',
    },
    {
        name: 'Executioner',
        health: 15,
        challenge: 'sentence',
        reward: '+1 life',
        src: 'executioner',
        code: `socket.emit('updateHealth', player.id, 1);`,
    },
    {
        name: 'Golden Dragon',
        health: 18,
        challenge: 'sentence',
        reward: 'make a rule',
        src: 'golden_dragon',
    },
    {
        name: 'Formicid',
        health: 4,
        challenge: 'trivia',
        reward: 'none',
        src: 'formicid',
    },
    {
        name: 'Slimy Boi',
        health: 5,
        challenge: 'trivia',
        reward: 'none',
        src: 'giant_amoeba_new',
    },
    {
        name: 'Fucking Bull Thing',
        health: 6,
        challenge: 'trivia',
        reward: 'none',
        src: 'mutant_beast',
    },
    {
        name: 'Infernal',
        health: 9,
        challenge: 'rhyme',
        reward: 'none',
        src: 'golden_dragon',
    },
    {
        name: 'Lorocyproca',
        health: 12,
        challenge: 'rhyme',
        reward: '+1 life',
        src: 'lorocyproca_old',
        code: `socket.emit('updateHealth', player.id, 1);`,
    },
    {
        name: 'Orange Demon',
        health: 15,
        challenge: 'rhyme',
        reward: 'make a rule',
        src: 'orange_demon_new',
    },
    {
        name: 'Shining Eye',
        health: 12,
        challenge: 'random',
        reward: '+1 potion',
        src: 'shining_eye_new',
        code: `socket.emit('updatePotions', player.id, 1);`,
    },
    {
        name: 'Ugly Thing',
        health: 15,
        challenge: 'random',
        reward: '+1 potion',
        src: 'ugly_thing',
        code: `socket.emit('updatePotions', player.id, 1);`,
    },
    {
        name: 'Vine Stalker',
        health: 18,
        challenge: 'random',
        reward: '+1 potion',
        src: 'ugly_thing',
        code: `socket.emit('updatePotions', player.id, 1);`,
    },
];
