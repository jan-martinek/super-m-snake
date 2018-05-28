const P5 = require('p5');
const { renderNodes } = require('./renderer.js');
const { detectSnakeCollision } = require('./collisions');

const deployed = [];

function Special(p, snake, parts, updateFn, params) {
  this.owner = snake;
  this.parts = parts;
  this.updateFn = updateFn;
  this.params = params;

  this.render = () => this.parts.forEach(nodes => renderNodes(p, this.owner.color, nodes));

  this.doesCollide = head => this.parts.reduce((hit, nodes) => hit || detectSnakeCollision(nodes, head), false);
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

module.exports = {
  deployed,
  createCurb,
};
