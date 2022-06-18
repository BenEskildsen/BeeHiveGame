// @flow

/**
 *  Checklist:
 *    - add entity file to this directory
 *    - add reference here keyed by type in render order
 *    - add any new properties here and updating function in the tickReducer
 */

const Entities = {
  BACKGROUND: require('./background.js'),

  CELL: require('./cell.js'),
  HONEY: require('./honey.js'),
  EGG: require('./egg.js'),
  LARVA: require('./larva.js'),
  PUPA: require('./pupa.js'),

  BEE: require('./bee.js'),
};

const Properties = {
  isActor: 'ACTOR', // actors do actions
  isAgent: 'AGENT', // agents decide their own actions
  // inGrid: 'IN_GRID', // entities that must be snapped to the grid, a special property
  isMaturing: 'MATURING',
};

module.exports = {Entities, Properties};
