// @flow

const {Entities, Properties} = require('./entities/registry');

const initState = (): State => {
  return {
    screen: 'LOBBY',
    game: null,
    isMuted: true,
  };
};

const initGameState = (): Game => {
  const game = {
    time: 0,
    tickInterval: null,
    level: '',

    viewWidth: 50,
    viewHeight: 50,
    viewPos: {x: 0, y: 0},

    gridWidth: 50,
    gridHeight: 50,

    nextID: 1,
    entities: {},
  };

  for (const property in Properties) {
    game[Properties[property]] = {};
  }

  for (const entityType in Entities) {
    game[entityType] = {};
  }

  return game;
};

module.exports = {
  initState, initGameState,
};
