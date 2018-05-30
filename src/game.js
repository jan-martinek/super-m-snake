const P5 = require('./p5-dev/p5.min');
const specials = require('./specials');
const persist = require('./persist');
const martin = require('./martin');
const { detectSnakeCollision } = require('./collisions');
const { renderNodes } = require('./renderer');

const padding = 20;
const menuPadding = 20;
const spawnPadding = (window.innerWidth + window.innerHeight) * 0.1;
const players = [];
let mode = 'menu';
let gameOver = false;
let winner;
let winnerMessage;
let p5instance;
let snakes = [];
const hits = [];
let hitShake = 0;
let hitDir;
const scoreAnimations = [];

function sketch(p) {
  p5instance = p;

  p.setup = () => {
    p.createCanvas(window.innerWidth, window.innerHeight);
  };

  p.draw = () => {
    p.clear();

    renderShake(p);

    if (mode === 'game') {
      renderFrame(p);

      pollGameControls(p);
      snakes.forEach(snake => snake.move());
      specials.deployed.forEach(special => special.update());
      snakes.forEach(snake => snake.checkHit());
      snakes.forEach(snake => snake.renderBody());
      specials.deployed.forEach(special => special.render());
      snakes.forEach(snake => snake.renderHit());
      renderScoreAnimations(p);
      renderScore();

      p.fill(255);
      hits.forEach(hit => p.ellipse(hit.x, hit.y, 100));

      renderFrame(p);
    }

    if (gameOver) renderGameOver(p);
  };

  p.keyReleased = () => {
    if (p.keyCode === 32 && gameOver) {
      start();
    }

    if (!gameOver) {
      players.forEach((player) => {
        if (p.keyCode === player.controls.special) {
          snakes.filter(snake => snake.owner === player)[0].triggerSpecial();
        }
      });
    }
  };
}

function renderGameOver(p) {
  p.background(0, 170);
  p.textSize(70);
  p.fill(winner.color);
  p.stroke('black');
  p.strokeWeight(2);
  p.textAlign(p.CENTER);
  p.text(`${winner.name} wins!`, 0, (window.innerHeight * 0.4) - 30, window.innerWidth, 100);

  p.fill('white');
  p.textSize(20);
  p.textStyle(p.ITALIC);
  p.text(
    winnerMessage,
    0,
    (window.innerHeight * 0.4) + 60,
    window.innerWidth,
    120,
  );

  p.textStyle(p.NORMAL);
  p.text('press SPACE to continue', 0, (window.innerHeight) - 60, window.innerWidth, 100);
}

function renderFrame(p) {
  p.stroke(255);
  p.noFill();
  p.strokeWeight(3);
  p.rect(
    padding,
    padding + menuPadding,
    p.width - (padding * 2),
    p.height - ((padding * 2) + menuPadding),
    padding / 2,
  );
}

function renderShake(p) {
  if (hitShake > 0) {
    const mag = Math.sin(p.PI * hitShake) * 10;
    hitDir.setMag(mag);
    p.translate(hitDir.x, hitDir.y);
    hitShake -= 0.1;
  }
}

function renderScore() {
  const p = p5instance;

  p.push();
  p.translate(20, 10);

  players.filter(player => player.active).forEach((player, index) => {
    p.stroke(player.color);
    renderIcons(p, snakes[index].inventory);

    p.fill(player.color);
    p.noStroke();
    p.textSize(20);
    p.textAlign(p.LEFT);
    p.text(`${player.name}: ${player.score}`, 0, 17);

    p.translate(150, 0);
  });

  p.pop();
}

function renderIcons(p, inventory) {
  p.noFill();

  inventory.forEach((special) => {
    renderSpecialIcon(p, special);
    p.translate(30, 0);
  });

  return inventory.length * 30;
}

function renderSpecialIcon(p, special) {
  p.push();
  p.strokeWeight(2);
  specials[`render${special}Icon`](p);

  p.ellipseMode(p.CORNER);
  p.ellipse(0, 0, 20, 20);
  p.pop();
}

function setupPlayers(config) {
  const conf = persist.loadPlayers() || config.players;
  conf.forEach(player => players.push(Object.assign({}, { score: 0 }, player)));
}

function pollGameControls() {
  snakes.forEach((snake, index) => {
    if (snake.hit) return;
    if (p5instance.keyIsDown(snake.owner.controls.left)) snake.steer(-1);
    if (p5instance.keyIsDown(snake.owner.controls.right)) snake.steer(1);
  });
}

function start() {
  snakes = players
    .filter(player => player.active)
    .map(player => new Snake(player));

  specials.deployed.length = 0;

  mode = 'game';
  gameOver = false;
}

function getRandomBoardPixel() {
  return p5instance.createVector(
    p5instance.random(menuPadding + spawnPadding, p5instance.width - spawnPadding),
    p5instance.random(menuPadding + spawnPadding, p5instance.height - spawnPadding),
  );
}

function updateName(id, name) {
  players[id].name = name;
  persist.savePlayers(players);
}

function updateActive(id, status) {
  players[id].active = status;
  persist.savePlayers(players);
}


function Snake(player) {
  this.owner = player;
  this.steered = true;
  this.nodes = [getRandomBoardPixel(p5instance)];
  this.color = this.owner.color;
  this.hit = false;
  this.inventory = ['Beam', 'Shuriken', 'Curb'];
  let dir = P5.Vector.fromAngle(p5instance.random(0, p5instance.TAU)).setMag(2);

  this.getPos = () => this.nodes[this.nodes.length - 1].copy();

  this.getDir = () => dir.copy();

  this.move = () => (this.hit
    ? null
    : this.steered
      ? this.addPos()
      : this.movePos());

  this.movePos = () => {
    this.nodes[this.nodes.length - 1] = P5.Vector.add(this.getPos(), dir);
  };

  this.addPos = () => {
    this.nodes.push(P5.Vector.add(this.getPos(), dir));
    this.steered = false;
  };

  this.steer = (amount) => {
    dir.rotate((amount * p5instance.PI) / 50);
    this.steered = true;
  };

  this.checkHit = () => {
    if (!this.hit) {
      if (this.checkCollision() || this.checkEdges()) {
        hitShake = 1;
        hitDir = this.getDir();
        this.hit = true;
        this.calcOverScore();
      }
    }
  };

  this.addScore = (points) => {
    this.owner.score += points;
    persist.savePlayers(players);

    scoreAnimations.push({
      frame: 0,
      pos: this.getPos(),
      color: this.color,
      points,
    });
  };

  this.calcOverScore = () => {
    const leftAlive = snakes.filter(snake => !snake.hit).length;
    if (leftAlive === 1) {
      const winningSnake = snakes.filter(snake => !snake.hit)[0];
      winningSnake.addScore(10);
      winner = snakes.filter(snake => !snake.hit)[0].owner;
      winnerMessage = martin.getMessage(winner.name, players);
      gameOver = true;
    }
  };

  this.getHead = () => {
    const frontNode = this.nodes[this.nodes.length - 1].copy();
    const tip = P5.Vector.add(frontNode, this.getDir().setMag(1));
    const neck = P5.Vector.sub(frontNode, this.getDir().setMag(1.9));
    return [tip, neck];
  };

  this.checkCollision = () => {
    const head = this.getHead();

    return snakes.reduce((hit, snake) => hit
      || detectSnakeCollision(snake.nodes, head), false)
      || detectSpecialCollision(this, head);
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
    if (special) specials[`create${special}`](this, p5instance);
  };

  this.renderBody = () => renderNodes(p5instance, this.color, this.nodes);

  this.renderHit = () => {
    if (!this.hit) return;

    const center = this.getPos();
    const vec = new P5.Vector(0, 10);
    const seed = new Date().getTime();

    p5instance.stroke(this.color);
    p5instance.beginShape();
    for (let i = 0; i < 16; i++) {
      const magBase = p5instance.noise((seed / 1000) + (i / 100)) * 7;
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

function renderScoreAnimations(p) {
  scoreAnimations.forEach((animation) => {
    if (animation.frame < 30) {
      const pos = animation.pos.copy().add(new P5.Vector(0, -10 - (2 * animation.frame)));
      p.push();
      p.textAlign(p.CENTER);
      p.fill(animation.color);
      p.noStroke();
      p.text(animation.points, pos.x, pos.y);
      animation.frame += 1;
      p.pop();
    }
  });
}

function detectSpecialCollision(snake, head) {
  return specials.deployed.reduce((hit2, special) => hit2 ||
    special.doesCollide(snake, head), false);
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

