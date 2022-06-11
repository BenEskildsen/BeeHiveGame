// @flow

const React = require('react');
const {Button, Modal} = require('bens_ui_components');
const {loadLevel} = require('../levels');
const Game = require('./Game.react');

type Props = {
  state: State,
  dispatch: (action: Action) => Action,
  store: Object,
  modal: Object,
};

function Main(props: Props): React.Node {
  const {state, modal} = props;
  let content = null;
  if (state.screen === 'LOBBY') {
    content = <Lobby {...props} />
  } else if (state.screen === 'GAME') {
    content = <Game {...props} />
  }

  return (
    <React.Fragment>
      {content}
      {modal}
    </React.Fragment>
  );
}

function Lobby(props): React.Node {
  return (
    <div
      style={{
        width: 300,
        margin: 'auto',
        marginTop: 150,
      }}
    >
      <Button
        label="Play"
        style={{
          width: 300,
          height: 30,
        }}
        onClick={() => {
          props.dispatch({
            type: 'SET_MODAL',
            modal: (<PlayModal store={store} dispatch={props.dispatch} />),
          });
        }}
      />
    </div>
  );
}

function PlayModal(props): React.Node {
  const {dispatch, store} = props;
  return (
    <Modal
      title={"Buzz Buzz REVOLUTION"}
      body={"Beeeeeeeeeeeeeeeees"}
      buttons={[
        {
          label: 'Play',
          onClick: () => {
            dispatch({type: 'DISMISS_MODAL'});
            dispatch({type: 'SET_SCREEN', screen: 'GAME'});
            loadLevel(store, 'testLevel');
          },
        }
      ]}
    />
  );
}

module.exports = Main;
