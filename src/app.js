const P5 = require('p5');
const detectCollision = require('./detectCollision');

const spawnPadding = 100;
const padding = 20;
const initial = {
  players: [{
    name: 'Martin',
    active: true,
    color: 'greenyellow',
    controls: {
      left: 37, // <--
      right: 39, // -->,
    },
  },
  {
    name: 'Petra',
    active: true,
    color: 'purple',
    controls: {
      left: 81, // Q
      right: 87, // W,
    },
  },
  {
    name: 'Pavla',
    active: true,
    color: 'pink',
    controls: {
      left: 79, // O
      right: 80, // P,
    },
  },
  {
    name: 'Honya',
    active: true,
    color: 'orange',
    controls: {
      left: 86, // V
      right: 66, // B,
    },
  }]
}

const hits = [];
const menu = {};
let mode = 'menu';
let snakes = [];
let setup;


function sketch(p) {
  p.setup = () => {
    p.createCanvas(window.innerWidth, window.innerHeight);
    setup = initial;
    setupMenu(p);
  }

  p.draw = () => {
    p.background(50);
    if (mode === 'game') {
      p.stroke(255);
      p.noFill();
      p.strokeWeight(3);
      p.rect(padding, padding, p.width - padding * 2, p.height - padding * 2, padding);

      pollGameControls(p);
      snakes.forEach(snake => snake.move());
      snakes.forEach(snake => snake.checkHit());
      snakes.forEach(snake => snake.render());

      p.fill(255);
      hits.forEach(hit => p.ellipse(hit.x, hit.y, 100));

    } else if (mode === 'menu') {

    } else if (mode === 'pause') {

    }
  };
}

function updateName(id) {
  return function() { setup.players[id].name = this.value(); }
}

function updateActive(id) {
  return function() { setup.players[id].active = this.checked(); }
}

function setupMenu(p) {
  menu.items = [];

  setup.players.forEach((player, index) => {
    const div = p.createDiv('');
    div.id(`player${index}`);
    div.position(100, (index * 100) + 100);

    const inp = p.createInput(player.name);
    inp.attribute('style', `color: ${player.color}; border-color: ${player.color}`);
    inp.input(updateName(index));
    div.child(inp);

    const checkbox = p.createCheckbox(' ', player.active);
    checkbox.changed(updateActive(index));
    div.child(checkbox);

    menu.items.push(div);
  });

  const div = p.createDiv('');
  div.position(100, (setup.players.length * 100) + 100);

  const button = p.createButton('PLAY');
  button.mousePressed(play(p));
  div.child(button);
  menu.items.push(div);
}

function play(p) {
  return () => {
    hideMenu();
    startGame(p);
  };
}

const showMenu = () => menu.items.forEach(item => item.show());

const hideMenu = () => menu.items.forEach(item => item.hide());

function pollGameControls(p) {
  setup.players.forEach((player, index) => {
    if (p.keyIsDown(player.controls.left)) snakes[index].steer(-1);
    if (p.keyIsDown(player.controls.right)) snakes[index].steer(1);
  });

  if (p.keyIsDown(32)) startGame(p);
}

const game = new P5(sketch);

function startGame(p) {
  snakes = initial.players
    .filter(player => player.active)
    .map(player => player.color)
    .map(color => new Snake(color, p));

  mode = 'game';
}

function getRandomBoardPixel(p) {
  return p.createVector(
    p.random(0 + spawnPadding, p.width - spawnPadding),
    p.random(0 + spawnPadding, p.height - spawnPadding),
  );
}

function Snake(color, p) {
  this.dir = P5.Vector.fromAngle(p.random(0, p.TAU)).setMag(2);
  this.steered = true;
  this.nodes = [getRandomBoardPixel(p)];
  this.color = color;
  this.hit = false;

  this.getPos = () => this.nodes[this.nodes.length - 1];

  this.move = () => (this.hit
    ? null
    : this.steered
      ? this.addPos()
      : this.movePos());

  this.movePos = () => {
    this.nodes[this.nodes.length - 1] = P5.Vector.add(this.getPos(), this.dir);
  };

  this.addPos = () => {
    this.nodes.push(P5.Vector.add(this.getPos(), this.dir));
    this.steered = false;
  };

  this.steer = (dir) => {
    this.dir.rotate((dir * p.PI) / 50);
    this.steered = true;
  };

  this.checkHit = () => {
    this.hit = this.hit || this.checkCollision() || this.checkEdges();
  };

  this.checkCollision = () => {
    const secA = [
      this.nodes[this.nodes.length - 1],
      this.nodes[this.nodes.length - 2]];

    return snakes.reduce((hit, snake) => {
      return hit || snake.nodes.reduce((secHit, node, index) => {
        if (secHit) return true;
        if (index === 0) return false;

        const secB = [node, snake.nodes[index - 1]];
        const thisIsLastSection = snake.nodes.length - 1 === index;
        const collision = this.detectSectionCollission(secA[0], secA[1], secB[0], secB[1]);

        if (collision) {
          if (thisIsLastSection) {
            const hitpoint = this.calcHit(secA[0], secA[1], secB[0], secB[1]);
            return P5.Vector.sub(hitpoint, secA[0]).mag() < P5.Vector.sub(hitpoint, secB[0]).mag();
          }
          return true;
        }
        return false;
      }, false);
    }, false);
  };

  this.detectSectionCollission = (n1, n2, tn1, tn2) => {
    if (n1 === tn1 || n1 === tn2 || n2 === tn1 || n2 === tn2) return false;

    return detectCollision(n1.x, n1.y, n2.x, n2.y, tn1.x, tn1.y, tn2.x, tn2.y);
  };

  this.calcHit = (n1, n2, tn1, tn2) => {
    const hit = detectCollision(n1.x, n1.y, n2.x, n2.y, tn1.x, tn1.y, tn2.x, tn2.y, true);
    return p.createVector(hit.x, hit.y);
  };

  this.checkEdges = () => {
    const pos = this.nodes[this.nodes.length - 1];
    return pos.x < padding
      || pos.x > p.width - padding
      || pos.y < padding
      || pos.y > p.height - padding;
  };

  this.render = () => {
    p.stroke(this.color);
    p.strokeWeight(3);
    this.nodes.forEach((section, index) => {
      if (index > 0) {
        const prev = this.nodes[index - 1];
        p.line(prev.x, prev.y, section.x, section.y);
      }
    });
  };

  this.renderDeco = () => {
    p.push();
    p.noStroke();
    p.fill(0, 0, 0, 50);
    p.ellipse(this.nodes[0].x, this.nodes[0].y, this.nodes[this.nodes.length - 1].x);
    p.pop();
  };
}
