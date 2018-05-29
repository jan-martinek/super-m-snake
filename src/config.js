module.exports = {
  players: [{
    name: 'Martin',
    active: true,
    color: '#30f3e3',
    controls: {
      left: 37, // <--
      right: 39, // -->,
      special: 38, // ^
    },
  },
  {
    name: 'Petra',
    active: true,
    color: '#30f340',
    controls: {
      left: 81, // Q
      right: 69, // E
      special: 87, // W,
    },
  },
  {
    name: 'Pavla',
    active: false,
    color: '#f330f3',
    controls: {
      left: 73, // I
      right: 80, // P,
      special: 79, // O
    },
  },
  {
    name: 'Honya',
    active: false,
    color: '#f3e330',
    controls: {
      left: 86, // V
      right: 78, // N
      special: 66, // B,
    },
  }],
};
