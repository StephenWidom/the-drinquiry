module.exports = [
    {
        name: 'Ethereal Amulet',
        text: 'You are a questionmaster. Anyone who answers your questions must drink.',
        modifier: 0,
        src: 'urand_bloodlust_new',
        code: `socket.emit('updateItem', player.id, 'amulet');`,
    },
    {
        name: 'Tower Shield',
        text: 'You gain a shield! If you fail an attack but the monster has 2 or fewer health, you survive.',
        modifier: 0,
        src: 'large_shield_1_new',
        code: `socket.emit('updateItem', player.id, 'shield');`,
    },
    {
        name: 'Stamina Potion',
        text: 'Gain 1 potion. Potions can be used to skip an attack.',
        modifier: 0,
        src: 'cyan_new',
        code: `socket.emit('updatePotions', player.id, 1);`,
    },
    {
        name: 'Holy Blessing',
        text: 'Gain 1 life!',
        modifier: 0,
        src: 'misc_deck_legendary_new',
        code: `socket.emit('updateHealth', player.id, 1);`,
    },
    {
        name: 'Monster Strength',
        text: 'The next monster has +2 health',
        modifier: 2,
        src: 'misc_deck_legendary_new',
        code: `socket.emit('updateModifier', 2);`,
    },
    {
        name: 'Rune of Strength',
        text: 'The next monster has -2 health',
        modifier: -2,
        src: 'rune_abyss',
        code: `socket.emit('updateModifier', -2);`,
    },
    {
        name: 'Cloud of Confusion',
        text: 'Shuffle the order of players!',
        modifier: 0,
        src: 'cloud_black_smoke',
        code: `socket.emit('shufflePlayers');`,
    },
    {
        name: 'Poisonous Cloud',
        text: 'Lose 1 life!',
        modifier: 0,
        src: 'cloud_meph_2',
        code: `socket.emit('updateHealth', player.id, -1);`,
    }
];
