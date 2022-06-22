// @flow

const React = require('react');
const {Button, Canvas} = require('bens_ui_components');
const {initKeyboardControlsDaemon} = require('../daemons/keyboardControlsDaemon');
const {makeAction} = require('../simulation/actionOperations');
const {useEffect} = React;

function Game(props): React.Node {
  const {state, dispatch, store} = props;

  useEffect(() => {
    initKeyboardControlsDaemon(store);
    registerHotkeys(dispatch);
  }, []);

  return (
    <div>
      <Canvas
        useFullScreen={true}
      />
    </div>
  );
}

function registerHotkeys(dispatch) {
  dispatch({
    type: 'SET_HOTKEY', press: 'onKeyDown',
    key: 'space',
    fn: (s) => {
      const game = s.getState().game;
      if (game.tickInterval) {
        dispatch({type: 'STOP_TICK'});
      } else {
        dispatch({type: 'START_TICK'});
      }
    }
  });

  dispatch({
    type: 'SET_HOTKEY', press: 'onKeyDown',
    key: 'G',
    fn: (s) => {
      const game = s.getState().game;
      if (!game.controlledEntity) return;
      let entityAction = makeAction(game, game.controlledEntity, 'PICKUP', {});
      if (game.controlledEntity.holding) {
        entityAction = makeAction(game, game.controlledEntity, 'PUTDOWN', {});
      }
      s.dispatch({type: 'QUEUE_ACTION', entity: game.controlledEntity, entityAction});
    }
  });

  dispatch({
    type: 'SET_HOTKEY', press: 'onKeyDown',
    key: 'E',
    fn: (s) => {
      const game = s.getState().game;
      if (!game.controlledEntity) return;
      const entityAction = makeAction(game, game.controlledEntity, 'LAY_EGG', {});
      s.dispatch({type: 'QUEUE_ACTION', entity: game.controlledEntity, entityAction});
    }
  });

  dispatch({
    type: 'SET_HOTKEY', press: 'onKeyDown',
    key: 'C',
    fn: (s) => {
      const game = s.getState().game;
      if (!game.controlledEntity) return;
      const entityAction = makeAction(game, game.controlledEntity, 'MAKE_BLUEPRINT', {});
      s.dispatch({type: 'QUEUE_ACTION', entity: game.controlledEntity, entityAction});
    }
  });
}

module.exports = Game;
