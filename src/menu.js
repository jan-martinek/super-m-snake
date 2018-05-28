const P5 = require('p5');

const game = require('./game.js');

const menu = {};

const initial = {
  players: [{
    name: 'Martin',
    active: true,
    color: '#30f3e3',
    controls: {
      left: 37, // <--
      right: 39, // -->,
      special: 38, // ^
    },
  },
  {
    name: 'Petra',
    active: true,
    color: '#3040f3',
    controls: {
      left: 81, // Q
      right: 69, // E
      special: 87, // W,
    },
  },
  {
    name: 'Pavla',
    active: false,
    color: '#f33040',
    controls: {
      left: 73, // I
      right: 80, // P,
      special: 79, // O
    },
  },
  {
    name: 'Honya',
    active: false,
    color: '#f3e330',
    controls: {
      left: 86, // V
      right: 78, // N
      special: 66, // B,
    },
  }],
};

function setupMenu() {
  game.setupPlayers(initial.players);

  new P5(game.sketch);
  const p = game.p5instance;

  menu.items = [];

  game.players.forEach((player, index) => {
    const div = document.createElement('DIV');
    div.setAttribute('id', `player${index}`);
    div.style.position = 'absolute';
    div.style.left = '100px';
    div.style.top = `${(index * 100) + 100}px`;

    const inp = document.createElement('INPUT');
    inp.style.color = player.color;
    inp.style.borderColor = player.color;
    inp.value = player.name;
    inp.addEventListener('input', () => game.updateName(index, inp.value));
    div.appendChild(inp);

    const checkbox = document.createElement('INPUT');
    checkbox.setAttribute('id', `p${index}`);
    checkbox.setAttribute('type', 'checkbox');
    checkbox.checked = player.active;
    checkbox.addEventListener('change', () => game.updateActive(index, checkbox.checked));
    div.appendChild(checkbox);

    const label = document.createElement('LABEL');
    label.setAttribute('for', `p${index}`);
    div.appendChild(label);

    menu.items.push(div);
  });

  const div = document.createElement('DIV');
  div.style.position = 'absolute';
  div.style.left = '100px';
  div.style.top = `${(game.players.length * 100) + 100}px`;

  const button = document.createElement('BUTTON');
  button.innerHTML = 'PLAY';
  button.addEventListener('click', play);
  div.appendChild(button);
  menu.items.push(div);

  menu.items.forEach(item => document.body.appendChild(item));
}

function play() {
  hideMenu();
  game.start();
}

const showMenu = () => menu.items.forEach(item => item.style.display = 'block');

const hideMenu = () => menu.items.forEach(item => item.style.display = 'none');

module.exports = {
  play,
  setupMenu,
  showMenu,
};
