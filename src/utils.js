export const isInGame = (id, players) => players.some(p => p.id === id);

export const getPlayer = (id, players) => players.find(p => p.id === id);

export const getActivePlayer = (active, players) => players.find(p => p.id === active);

export const isActive = (active, player) => player.id === active;

export const getBattlingPlayer = (battleTurn, players) => players.find(p => p.id === battleTurn);

export const isBattling = (battleTurn, player) => player.id === battleTurn;

