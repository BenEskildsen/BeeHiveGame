// @flow

const {Entities, Properties} = require('./entities/registry');
const {encodePosition} = require('bens_utils').helpers;

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

    viewWidth: 25,
    viewHeight: 25,
    viewPos: {x: 0, y: 0},

    gridWidth: 50,
    gridHeight: 50,
    grid: {},

    nextID: 1,
    entities: {},

    hotKeys: {
      onKeyDown: {},
      onKeyPress: {},
      onKeyUp: {},
      keysDown: {},
    },
  };

  for (const property in Properties) {
    game[Properties[property]] = {};
  }

  for (const entityType in Entities) {
    game[entityType] = {};
  }

  for (let x = 0; x < game.gridWidth; x++) {
    for (let y = 0; y < game.gridHeight; y++) {
      const adjX = y % 2 == 1 ? x + 0.5 : x;
      game.grid[encodePosition({x: adjX, y})] = [];
    }
  }

  return game;
};

module.exports = {
  initState, initGameState,
};
