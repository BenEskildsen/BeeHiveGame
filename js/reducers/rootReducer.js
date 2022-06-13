// @flow

const {initState, initGameState} = require('../state');
const {tickReducer} = require('./tickReducer');
const {entityReducer} = require('./entityReducer');
const {modalReducer} = require('./modalReducer');
const {hotKeysReducer} = require('./hotKeysReducer');

const rootReducer = (state: State, action: Action): State => {
  if (state === undefined) return initState();

  switch (action.type) {
    case 'SET_SCREEN': {
      const {screen} = action;
      let game = state.game;
      if (screen == 'GAME') {
        game = initGameState();
      }
      return {
        ...state,
        game,
        screen,
      };
    }
    case 'SET_CURRENT_LEVEL_NAME': {
      const {levelName} = action;
      return {
        ...state,
        levelName,
      };
    }
    case 'START_TICK':
    case 'STOP_TICK':
    case 'TICK':
      if (!state.game) return state;
      return {
        ...state,
        game: tickReducer(state.game, action),
      };
    case 'CREATE_ENTITY':
      if (!state.game) return state;
      return {
        ...state,
        game: entityReducer(state.game, action),
      };
    case 'SET_MODAL':
    case 'DISMISS_MODAL':
      return modalReducer(state, action);
    case 'SET_HOTKEY':
    case 'SET_KEY_PRESS': {
      if (!state.game) return state;
      return {
        ...state,
        game: {
          ...state.game,
          hotKeys: hotKeysReducer(state.game.hotKeys, action),
        }
      }
    }
  };

  return state;
};

module.exports = {rootReducer};
