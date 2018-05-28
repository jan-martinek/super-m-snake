const P5 = require('p5');
const specials = require('./specials.js');
const { detectSnakeCollision } = require('./collisions');
const { renderNodes } = require('./renderer.js');

const padding = 20;
const menuPadding = 20;
const spawnPadding = 100;
const players = [];
let mode = 'menu';
let p5instance;
let snakes = [];
const hits = [];


function sketch(p) {
  p5instance = p;

  p.setup = () => {
    p.createCanvas(window.innerWidth, window.innerHeight);
  };

  p.draw = () => {
    p.background(50);
    if (mode === 'game') {
      p.stroke(255);
      p.noFill();
      p.strokeWeight(3);
      p.rect(padding, padding + menuPadding, p.width - (padding * 2), p.height - ((padding * 2) + menuPadding), padding / 2);

      pollGameControls(p);
      snakes.forEach(snake => snake.move());
      snakes.forEach(snake => snake.checkHit());
      snakes.forEach(snake => snake.renderBody());
      snakes.forEach(snake => snake.renderHit());

      specials.deployed.forEach(special => special.render());

      p.fill(255);
      hits.forEach(hit => p.ellipse(hit.x, hit.y, 100));

    } else if (mode === 'menu') {

    } else if (mode === 'pause') {

    }
  };
}

function setupPlayers(conf) {
  conf.forEach(player => players.push(player));
}

function pollGameControls() {
  snakes.forEach((snake, index) => {
    if (snake.hit) return;
    if (p5instance.keyIsDown(players[index].controls.left)) snake.steer(-1);
    if (p5instance.keyIsDown(players[index].controls.right)) snake.steer(1);
    if (p5instance.keyIsDown(players[index].controls.special)) snake.triggerSpecial();
  });

  if (p5instance.keyIsDown(32)) start();
}

function start() {
  snakes = players
    .filter(player => player.active)
    .map(player => player.color)
    .map(color => new Snake(color));

  specials.deployed.length = 0;

  mode = 'game';
}

function getRandomBoardPixel() {
  return p5instance.createVector(
    p5instance.random(menuPadding + spawnPadding, p5instance.width - spawnPadding),
    p5instance.random(menuPadding + spawnPadding, p5instance.height - spawnPadding),
  );
}

function updateName(id, name) {
  players[id].name = name;
}

function updateActive(id, status) {
  players[id].active = status;
}


function Snake(color) {
  this.dir = P5.Vector.fromAngle(p5instance.random(0, p5instance.TAU)).setMag(2);
  this.steered = true;
  this.nodes = [getRandomBoardPixel(p5instance)];
  this.color = color;
  this.hit = false;
  this.inventory = ['createCurb'];

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
    this.dir.rotate((dir * p5instance.PI) / 50);
    this.steered = true;
  };

  this.checkHit = () => {
    this.hit = this.hit || this.checkCollision() || this.checkEdges();
  };

  this.checkCollision = () => {
    const head = [
      this.nodes[this.nodes.length - 1],
      this.nodes[this.nodes.length - 2]];

    return snakes.reduce((hit, snake) => hit
      || detectSnakeCollision(snake.nodes, head), false)
      || detectSpecialCollision(head);
  };

  this.checkEdges = () => {
    const pos = this.nodes[this.nodes.length - 1];
    return pos.x < padding
      || pos.x > p5instance.width - padding
      || pos.y < padding + menuPadding
      || pos.y > p5instance.height - padding;
  };

  this.triggerSpecial = () => {
    const special = this.inventory.shift();
    if (special) specials[special](this, p5instance);
  };

  this.renderBody = () => renderNodes(p5instance, this.color, this.nodes);

  this.renderHit = () => {
    if (!this.hit) return;

    const center = this.getPos().copy();
    const vec = new P5.Vector(0, 10);
    const seed = new Date().getTime();

    p5instance.stroke(this.color);
    p5instance.beginShape();
    for (let i = 0; i < 16; i++) {
      const magBase = p5instance.noise(seed / 1000 + (i / 100)) * 7;
      const flickerDir = (Math.round(i % 2) * 2) - 1;
      const magFlicker = flickerDir * p5instance.noise(seed / 1000) * 5;

      vec.rotate(p5instance.PI / 8).setMag(10 + magBase + magFlicker);
      p5instance.vertex(center.x + vec.x, center.y + vec.y);
    }
    p5instance.endShape(p5instance.CLOSE);
  };

  this.renderDeco = () => {
    p5instance.push();
    p5instance.noStroke();
    p5instance.fill(0, 0, 0, 50);
    p5instance.ellipse(this.nodes[0].x, this.nodes[0].y, this.nodes[this.nodes.length - 1].x);
    p5instance.pop();
  };
}

function detectSpecialCollision(head) {
  return specials.deployed.reduce((hit2, special) => hit2 || special.doesCollide(head), false);
}

module.exports = {
  p5instance,
  mode,
  players,
  sketch,
  start,
  setupPlayers,
  updateName,
  updateActive,
};

