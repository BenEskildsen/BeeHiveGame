// @flow

const {Entities} = require('./entities/registry');

const loadLevel = (store, levelName): void => {
  const {dispatch} = store;

  dispatch({type: 'SET_CURRENT_LEVEL_NAME', levelName});

  // level placeholder:
  dispatch({
    type: 'CREATE_ENTITY',
    entityType: 'BACKGROUND',
    args: [{x: 0, y: 0}, 50, 50, 0],
  });

  dispatch({
    type: 'CREATE_ENTITY',
    entityType: 'BEE',
    args: [{x: 10, y: 10}],
  });

  for (let y = 10; y < 13; y++) {
    for (let x = 10; x < 15; x++) {
      const adjX = y % 2 == 1 ? x + 0.5 : x;
      let holding = null;
      if (x == 12 && y == 12) {
        holding = Entities.HONEY.make();
      }
      if (x == 12 && y == 11) {
        holding = Entities.HONEY.make();
      }
      if (x == 11 && y == 11) {
        holding = Entities.HONEY.make();
      }
      dispatch({
        type: 'CREATE_ENTITY',
        entityType: 'CELL',
        args: [{x: adjX, y}, holding],
      });
    }
  }

};

module.exports = {
  loadLevel,
};
