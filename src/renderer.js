function renderNodes(p, color, nodes) {
  p.stroke(color);
  p.strokeWeight(3);
  nodes.forEach((section, index) => {
    if (index > 0) {
      const prev = nodes[index - 1];
      p.line(prev.x, prev.y, section.x, section.y);
    }
  });
}

module.exports = {
  renderNodes,
};
