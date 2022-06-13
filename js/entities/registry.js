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

  BEE: require('./bee.js'),
};

const Properties = {
  isActor: 'ACTOR', // actors do actions
  isAgent: 'AGENT', // agents decide their own actions
  isMaturing: 'MATURING',
};

module.exports = {Entities, Properties};
