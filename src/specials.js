const P5 = require('p5');
const { renderNodes } = require('./renderer.js');
const { detectSnakeCollision } = require('./collisions');

const deployed = [];

function Special(p, snake, parts, updateFn, params) {
  this.snake = snake;
  this.parts = parts;
  this.updateFn = updateFn;
  this.params = params;

  this.render = () => this.parts.forEach(nodes => renderNodes(p, this.snake.color, nodes));

  this.update = () => {
    if (this.updateFn) this.updateFn(this);
  };

  this.doesCollide = (otherSnake, head) => {
    const collision = this.parts.reduce((hit, nodes) =>
      hit || detectSnakeCollision(nodes, head), false);

    if (collision) {
      this.updateFn = null;
      if (this.snake !== otherSnake) {
        this.snake.addScore(5);
      }
    }
    return collision;
  };
}

function createCurb(snake, p) {
  const pos = snake.getPos();
  const dir = snake.dir.copy().rotate(p.HALF_PI);

  const parts = [
    [P5.Vector.add(pos, dir.setMag(7)), P5.Vector.add(pos, dir.setMag(30))],
    [P5.Vector.add(pos, dir.setMag(-7)), P5.Vector.add(pos, dir.setMag(30))],
  ];

  deployed.push(new Special(p, snake, parts));
}

function createShuriken(snake, p) {
  const r = 10;
  const spikes = 10;

  const dir = snake.dir.copy();
  const pos = P5.Vector.add(snake.getPos(), dir.setMag(2 * r));

  const parts = [[]];
  const spikeDir = dir.copy();
  for (let i = 0; i <= spikes; i++) {
    const spikeLen = r / ((i % 2) + 0.5);
    parts[0].push(P5.Vector.add(pos, spikeDir.setMag(spikeLen)));
    spikeDir.rotate(p.TWO_PI / spikes);
  }

  const updateFn = (special) => {
    special.parts[0] = special.parts[0].map(node => P5.Vector.add(node, special.params.dir));
  };

  deployed.push(new Special(p, snake, parts, updateFn, { dir: dir.setMag(2) }));
}

module.exports = {
  deployed,
  createCurb,
  createShuriken,
};
