// @flow

const React = require('react');
const {Button, Canvas} = require('bens_ui_components');

function Game(props): React.Node {
  const {state, dispatch, store} = props;

  return (
    <div>
      <Canvas
        useFullScreen={true}
      />
    </div>
  );
}

module.exports = Game;
