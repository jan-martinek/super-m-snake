const P5 = require('p5');
const config = require('./config.js');
const game = require('./game.js');

const menu = {};


function init() {
  game.setupPlayers(config);
  setupMenu();
  new P5(game.sketch);
}

function setupMenu() {
  menu.items = [];

  game.players.forEach((player, index) => {
    const div = document.createElement('DIV');
    div.setAttribute('id', `player${index}`);
    div.style.position = 'absolute';
    div.style.left = '100px';
    div.style.top = `${(index * 100) + 100}px`;

    const checkbox = document.createElement('INPUT');
    checkbox.setAttribute('id', `p${index}`);
    checkbox.setAttribute('type', 'checkbox');
    checkbox.checked = player.active;
    checkbox.addEventListener('change', () => game.updateActive(index, checkbox.checked));
    div.appendChild(checkbox);

    const inp = document.createElement('INPUT');
    inp.style.color = player.color;
    inp.style.borderColor = player.color;
    inp.setAttribute('size', 8);
    inp.setAttribute('maxlength', 8);
    inp.value = player.name;
    inp.addEventListener('input', () => game.updateName(index, inp.value));
    div.appendChild(inp);

    const span = document.createElement('SPAN');
    span.classList.add('score');
    span.innerHTML = player.score;
    span.style.color = player.color;
    div.appendChild(span);

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

const showMenu = () => menu.items.forEach((item) => {
  item.style.display = 'block';
});

const hideMenu = () => menu.items.forEach((item) => {
  item.style.display = 'none';
});

module.exports = {
  play,
  init,
  showMenu,
};
