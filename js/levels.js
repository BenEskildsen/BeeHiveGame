// @flow

const {Entities} = require('./entities/registry');

const loadLevel = (store, levelName): void => {
  const {dispatch} = store;

  dispatch({type: 'SET_CURRENT_LEVEL_NAME', levelName});

  // level placeholder:
  dispatch({
    type: 'CREATE_ENTITY',
    entityType: 'BACKGROUND',
    args: [{x: 0, y: 0}, 25, 25, 0],
  });

  dispatch({
    type: 'CREATE_ENTITY',
    entityType: 'BEE',
    args: [{x: 10, y: 10}],
  });

  dispatch({
    type: 'CREATE_ENTITY',
    entityType: 'BEE',
    args: [{x: 11.5, y: 11}],
  });
  dispatch({
    type: 'CREATE_ENTITY',
    entityType: 'BEE',
    args: [{x: 12.5, y: 11}],
  });

  for (let y = 10; y < 16; y++) {
    for (let x = 10; x < 18; x++) {
      const adjX = y % 2 == 1 ? x + 0.5 : x;
      let holding = null;
      if (x == 12 && y == 12) {
        holding = Entities.HONEY.make();
      }
      if (x == 14 && y == 14) {
        holding = Entities.HONEY.make();
      }
      if (x == 14.5 && y == 13) {
        holding = Entities.HONEY.make();
      }
      if (x == 15 && y == 14) {
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
        entityType: y < 15 ? 'CELL' : 'BLUEPRINT',
        args: [{x: adjX, y}, holding],
      });
    }
  }


};

module.exports = {
  loadLevel,
};
