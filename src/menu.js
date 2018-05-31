const P5 = require('./p5-dev/p5.min');
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
    div.style.left = '9vw';
    div.style.top = `${(index * 9) + 9}vw`;

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

    const controls = document.createElement('DIV');
    controls.classList.add('controls');
    controls.innerHTML = `
      <b>${letterFromKeycode(player.controls.left)}</b>
      <b>${letterFromKeycode(player.controls.special)}</b>
      <b>${letterFromKeycode(player.controls.right)}</b>
    `;
    div.appendChild(controls);

    const label = document.createElement('LABEL');
    label.setAttribute('for', `p${index}`);
    div.appendChild(label);

    menu.items.push(div);
  });

  const div = document.createElement('DIV');
  div.style.position = 'absolute';
  div.style.left = '9vw';
  div.style.top = `${(game.players.length * 9) + 11}vw`;

  const button = document.createElement('BUTTON');
  button.innerHTML = 'PLAY';
  button.addEventListener('click', play);
  div.appendChild(button);
  menu.items.push(div);

  menu.items.forEach(item => document.body.appendChild(item));

  button.focus();
}

function play(e) {
  e.target.blur();
  hideMenu();
  game.start();
}

const showMenu = () => menu.items.forEach((item) => {
  document.querySelector('button').focus();
  item.style.display = 'block';
});

const hideMenu = () => menu.items.forEach((item) => {
  item.style.display = 'none';
});


function letterFromKeycode(keyCode) { /* eslint-disable */
  return ['', '', '', 'CANCEL', '', '', 'HELP', '', 'BACK_SPACE', 'TAB',
  '', '', 'CLEAR', 'ENTER', 'ENTER_SPECIAL', '', 'SHIFT', 'CONTROL', 'ALT', 'PAUSE',
  'CAPS_LOCK', 'KANA', 'EISU', 'JUNJA', 'FINAL', 'HANJA', '', 'ESCAPE', 'CONVERT', 'NONCONVERT',
  'ACCEPT', 'MODECHANGE', 'SPACE', 'PAGE_UP', 'PAGE_DOWN', 'END', 'HOME', '&#8592;', '&#8593;', '&#8594;',
  '&#8595;', 'SELECT', 'PRINT', 'EXECUTE', 'PRINTSCREEN', 'INSERT', 'DELETE', '', '0', '1',
  '2', '3', '4', '5', '6', '7', '8', '9', 'COLON', 'SEMICOLON',
  'LESS_THAN', 'EQUALS', 'GREATER_THAN', 'QUESTION_MARK', 'AT', 'A', 'B', 'C', 'D', 'E',
  'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O',
  'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y',
  'Z', 'OS_KEY', '', 'CONTEXT_MENU', '', 'SLEEP', 'NUMPAD0', 'NUMPAD1', 'NUMPAD2', 'NUMPAD3',
  'NUMPAD4', 'NUMPAD5', 'NUMPAD6', 'NUMPAD7', 'NUMPAD8', 'NUMPAD9', 'MULTIPLY', 'ADD', 'SEPARATOR', 'SUBTRACT',
  'DECIMAL', 'DIVIDE', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8',
  'F9', 'F10', 'F11', 'F12', 'F13', 'F14', 'F15', 'F16', 'F17', 'F18',
  'F19', 'F20', 'F21', 'F22', 'F23', 'F24', '', '', '', '',
  '', '', '', '', 'NUM_LOCK', 'SCROLL_LOCK', 'WIN_OEM_FJ_JISHO', 'WIN_OEM_FJ_MASSHOU', 'WIN_OEM_FJ_TOUROKU', 'WIN_OEM_FJ_LOYA',
  'WIN_OEM_FJ_ROYA', '', '', '', '', '', '', '', '', '',
  'CIRCUMFLEX', 'EXCLAMATION', 'DOUBLE_QUOTE', 'HASH', 'DOLLAR', 'PERCENT', 'AMPERSAND', 'UNDERSCORE', 'OPEN_PAREN', 'CLOSE_PAREN',
  'ASTERISK', 'PLUS', 'PIPE', 'HYPHEN_MINUS', 'OPEN_CURLY_BRACKET', 'CLOSE_CURLY_BRACKET', 'TILDE', '', '', '',
  '', 'VOLUME_MUTE', 'VOLUME_DOWN', 'VOLUME_UP', '', '', 'SEMICOLON', 'EQUALS', 'COMMA', 'MINUS',
  'PERIOD', 'SLASH', 'BACK_QUOTE', '', '', '', '', '', '', '',
  '', '', '', '', '', '', '', '', '', '',
  '', '', '', '', '', '', '', '', '', 'OPEN_BRACKET',
  'BACK_SLASH', 'CLOSE_BRACKET', 'QUOTE', '', 'META', 'ALTGR', '', 'WIN_ICO_HELP', 'WIN_ICO_00', '',
  'WIN_ICO_CLEAR', '', '', 'WIN_OEM_RESET', 'WIN_OEM_JUMP', 'WIN_OEM_PA1', 'WIN_OEM_PA2', 'WIN_OEM_PA3', 'WIN_OEM_WSCTRL', 'WIN_OEM_CUSEL',
  'WIN_OEM_ATTN', 'WIN_OEM_FINISH', 'WIN_OEM_COPY', 'WIN_OEM_AUTO', 'WIN_OEM_ENLW', 'WIN_OEM_BACKTAB', 'ATTN', 'CRSEL', 'EXSEL', 'EREOF',
  'PLAY', 'ZOOM', '', 'PA1', 'WIN_OEM_CLEAR', ''][keyCode];
}

module.exports = {
  play,
  init,
  showMenu,
};
