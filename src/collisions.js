const P5 = require('p5');


function detectSnakeCollision(nodes, head) {
  return nodes.reduce((hit, node, index) => {
    if (hit) return true;
    if (index === 0) return false;

    const secB = [node, nodes[index - 1]];
    const thisIsLastSection = nodes.length - 1 === index;
    const collision = detectSectionCollission(head[0], head[1], secB[0], secB[1]);

    if (collision) {
      if (thisIsLastSection) {
        const hitpoint = calcHit(head[0], head[1], secB[0], secB[1]);
        return P5.Vector.sub(hitpoint, head[0]).mag() < P5.Vector.sub(hitpoint, secB[0]).mag();
      }
      return true;
    }
    return false;
  }, false);
}

function detectSectionCollission(n1, n2, tn1, tn2) {
  if (n1 === tn1 || n1 === tn2 || n2 === tn1 || n2 === tn2) return false;
  return detectLineLine(n1.x, n1.y, n2.x, n2.y, tn1.x, tn1.y, tn2.x, tn2.y);
}

function calcHit(n1, n2, tn1, tn2) {
  const hit = detectLineLine(n1.x, n1.y, n2.x, n2.y, tn1.x, tn1.y, tn2.x, tn2.y, true);
  return new P5.Vector(hit.x, hit.y);
}

/* Adopted from https://github.com/bmoren/p5.collide2D#collidelineline */
function detectLineLine(x1, y1, x2, y2, x3, y3, x4, y4, calcIntersection) {
  // calculate the distance to intersection point
  const uA = (((x4 - x3) * (y1 - y3)) - ((y4 - y3) * (x1 - x3)))
    / (((y4 - y3) * (x2 - x1)) - ((x4 - x3) * (y2 - y1)));
  const uB = (((x2 - x1) * (y1 - y3)) - ((y2 - y1) * (x1 - x3)))
    / (((y4 - y3) * (x2 - x1)) - ((x4 - x3) * (y2 - y1)));

  // if uA and uB are between 0-1, lines are colliding
  if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
    return calcIntersection ? { x: x1 + (uA * (x2 - x1)), y: y1 + (uA * (y2 - y1)) } : true;
  }
  return calcIntersection ? { x: false, y: false } : false;
}


module.exports = {
  detectSnakeCollision,
};
