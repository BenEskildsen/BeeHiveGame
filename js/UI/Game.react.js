// @flow

const React = require('react');
const {Button, Canvas} = require('bens_ui_components');
const {initKeyboardControlsDaemon} = require('../daemons/keyboardControlsDaemon');
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
}

module.exports = Game;
