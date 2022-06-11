// @flow

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

  dispatch({
    type: 'CREATE_ENTITY',
    entityType: 'CELL',
    args: [{x: 11, y: 11}],
  });
  dispatch({
    type: 'CREATE_ENTITY',
    entityType: 'CELL',
    args: [{x: 12, y: 11}],
  });
  dispatch({
    type: 'CREATE_ENTITY',
    entityType: 'CELL',
    args: [{x: 12, y: 12}],
  });
  dispatch({
    type: 'CREATE_ENTITY',
    entityType: 'CELL',
    args: [{x: 13, y: 13}],
  });


};

module.exports = {
  loadLevel,
};
