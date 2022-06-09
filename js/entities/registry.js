// @flow

/**
 *  Checklist:
 *    - add file to this directory
 *    - add here keyed by type in render order
 *    - add options and arguments to level editor
 *    - add any new properties to gameState initialization and updating
 *      function for them in the tickReducer
 */

const Entities = {
  BACKGROUND: require('./background.js');

  CELL: require('./cell.js');

  BEE: require('./bee.js');
};

module.exports = Entities;
