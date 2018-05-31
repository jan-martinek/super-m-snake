function detectSnakeCollision(nodes, pos) {
  return nodes.reduce((hit, node, index) => {
    if (hit) return true;
    if (index === 0) return false;

    const s = [node, nodes[index - 1]];
    const thisIsLastSection = nodes.length - 1 === index;

    if (thisIsLastSection && pos.x === node.x && pos.y === node.y) return false;

    return detectPointLine(pos.x, pos.y, s[0].x, s[0].y, s[1].x, s[1].y);
  }, false);
}

function detectPointLine(px, py, x1, y1, x2, y2) {
  const d1 = dist(px, py, x1, y1);
  const d2 = dist(px, py, x2, y2);
  const lineLen = dist(x1, y1, x2, y2);

  const buffer = 0.5 / Math.sqrt(lineLen);
  return d1 < 1.5 || d2 < 1.5 || (d1 + d2 >= lineLen - buffer && d1 + d2 <= lineLen + buffer);
}

function dist(x1, y1, x2, y2) {
  return Math.hypot(x2 - x1, y2 - y1);
}

module.exports = {
  detectSnakeCollision,
};
