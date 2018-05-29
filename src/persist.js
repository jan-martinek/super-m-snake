function savePlayers(players) {
  const config = JSON.parse(localStorage.getItem('gamestate'));
  localStorage.setItem('gamestate', JSON.stringify(Object.assign({}, config, { players })));
}

function loadPlayers() {
  const state = localStorage.getItem('gamestate');
  return state ? JSON.parse(state).players : null;
}

module.exports = {
  loadPlayers,
  savePlayers,
};
