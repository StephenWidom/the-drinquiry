module.exports = [
    {
        name: 'Ethereal Amulet',
        text: 'You are a questionmaster. Anyone who answers your questions must drink.',
        modifier: 0,
        src: 'urand_bloodlust_new',
        code: `socket.emit('updateItem', player.id, 'amulet');`,
    },
    {
        name: 'Magic Scroll',
        text: 'You can use this scroll to reveal a different prompt!',
        modifier: 0,
        src: 'scroll_yellow',
        code: `socket.emit('updateItem', player.id, 'scroll');`,
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
        text: 'The next monster has +3 health',
        modifier: 3,
        src: 'misc_lantern',
        code: `socket.emit('updateModifier', 3);`,
    },
    {
        name: 'Rune of Strength',
        text: 'The next monster has -3 health',
        modifier: -3,
        src: 'rune_abyss',
        code: `socket.emit('updateModifier', -3);`,
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
    },
    {
        name: 'Absolute Disaster',
        text: 'All players lose one life!',
        modifier: 0,
        src: 'zot',
        code: `socket.emit('absoluteDisaster');`,
    },
    {
        name: "King's Decree",
        text: 'Make a rule',
        modifier: 0,
        src: 'shining_one',
    },
    {
        name: 'Woopsie Daisey',
        text: 'Lose your scroll and/or amulet',
        modifier: 0,
        src: 'unseen_item_old',
        code: `socket.emit('loseItems', player.id);`,
    },
    {
        name: 'SOCIAL',
        text: 'Everyone drinks!',
        modifier: 0,
        src: 'blue_fountain',
    },
    {
        name: 'Give 2',
        text: 'Give two drinks to any one player',
        modifier: 0,
        src: 'control_undead_new',
    },
    {
        name: 'Take 2',
        text: 'Take two drinks to the dome-piece',
        modifier: 0,
        src: 'drink_two',
    },
    {
        name: 'Altar of Fairness',
        text: 'Everybody gets a scroll!',
        modifier: 0,
        src: 'ru',
        code: `socket.emit('giveEveryoneScrolls');`,
    },
    {
        name: 'Inexorably Linked',
        text: 'Choose a player. You must drink when they drink and vice versa.',
        modifier: 0,
        src: 'necromutation_old',
    },
];
