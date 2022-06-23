// @flow

const React = require('react');
const {
  Button, Canvas, Modal, AudioWidget, InfoCard,
} = require('bens_ui_components');
const {initKeyboardControlsDaemon} = require('../daemons/keyboardControlsDaemon');
const {makeAction} = require('../simulation/actionOperations');
const {config} = require('../config');
const {useEffect} = React;

function Game(props): React.Node {
  const {state, dispatch, store} = props;

  useEffect(() => {
    initKeyboardControlsDaemon(store);
    registerHotkeys(dispatch);
  }, []);

  return (
    <div>
      <MenuCard {...props} />
      <Canvas
        useFullScreen={true}
      />
    </div>
  );
}

function MenuCard(props): React.Node {
  const {state, dispatch} = props;
  const {game} = state;
  return (
    <InfoCard
      style={{
        position: 'absolute',
        top: 4,
        left: 4,
        zIndex: 2,
        backgroundColor: 'none',
        border: 'none',
      }}
    >
      <div>
      <Button
        label={game.tickInterval ? 'Pause' : 'Play'}
        onClick={() => {
          if (game.tickInterval) {
            dispatch({type: 'STOP_TICK'});
          } else {
            dispatch({type: 'START_TICK'});
          }
        }}
      />
      </div>
      <div>
      <Button
        label="Instructions"
        onClick={() => {
          dispatch({type: 'STOP_TICK'});
          dispatch({type: 'SET_MODAL',
            modal: <InstructionsModal dispatch={dispatch} />
          });
        }}
      />
      </div>
      <div>
        <AudioWidget
          audioFiles={config.audioFiles}
          style={{margin: 0}}
        />
      </div>
    </InfoCard>
  );
}

function InstructionsModal(props) {
  const {dispatch} = props;
  return (
    <Modal
      title={"Controls"}
      body={(<div>
        <div>
          Movement (hexagonally): <b>T Y F H V B</b>
        </div>
        <div>
          Pick up/Put down: <b>G</b>
        </div>
        <div>
          Lay eggs: <b>E</b>
        </div>
        <div>
          Create honeycomb blueprints: <b>C</b>
        </div>
        <div>
          Assign tasks to workers: <b>D</b>
        </div>
      </div>)}
      buttons={[
        {
          label: 'Back to Game',
          onClick: () => {
            dispatch({type: 'DISMISS_MODAL'});
            dispatch({type: 'START_TICK'});
          },
        }
      ]}
    />
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

  dispatch({
    type: 'SET_HOTKEY', press: 'onKeyDown',
    key: 'D',
    fn: (s) => {
      const game = s.getState().game;
      if (!game.controlledEntity) return;
      const {dispatch} = s;

      dispatch({type: 'STOP_TICK'});
      dispatch({
        type: 'SET_MODAL',
        modal: (
          <Modal
            title={"Choose Task"}
            body={(
              <div>
                <div>
                <Button
                  label="Feed Larva"
                  onClick={() => {
                    dispatch({type: 'DISMISS_MODAL'});
                    dispatch({type: 'START_TICK'});
                    const entityAction = makeAction(
                      game, game.controlledEntity, 'ASSIGN_TASKS_IN_RADIUS',
                      {radius: 5, task: 'FEED_LARVA'},
                    );
                    dispatch({type: 'QUEUE_ACTION',
                      entity: game.controlledEntity, entityAction,
                    });
                  }}
                />
                </div>
                <div>
                <Button
                  label="Build Cells"
                  onClick={() => {
                    dispatch({type: 'DISMISS_MODAL'});
                    dispatch({type: 'START_TICK'});
                    const entityAction = makeAction(
                      game, game.controlledEntity, 'ASSIGN_TASKS_IN_RADIUS',
                      {radius: 5, task: 'BUILD_CELL'},
                    );
                    dispatch({type: 'QUEUE_ACTION',
                      entity: game.controlledEntity, entityAction,
                    });
                  }}
                />
                </div>
                <div>
                <Button
                  label="Scout for Food"
                  onClick={() => {
                    dispatch({type: 'DISMISS_MODAL'});
                    dispatch({type: 'START_TICK'});
                    const entityAction = makeAction(
                      game, game.controlledEntity, 'ASSIGN_TASKS_IN_RADIUS',
                      {radius: 5, task: 'SCOUT'},
                    );
                    dispatch({type: 'QUEUE_ACTION',
                      entity: game.controlledEntity, entityAction,
                    });
                  }}
                />
                </div>
                <div>
                <Button
                  label="Retrieve Food"
                  onClick={() => {
                    dispatch({type: 'DISMISS_MODAL'});
                    dispatch({type: 'START_TICK'});
                    const entityAction = makeAction(
                      game, game.controlledEntity, 'ASSIGN_TASKS_IN_RADIUS',
                      {radius: 5, task: 'RETRIEVE_FOOD'},
                    );
                    dispatch({type: 'QUEUE_ACTION',
                      entity: game.controlledEntity, entityAction,
                    });
                  }}
                />
                </div>
              </div>
            )}
            buttons={[
              {
                label: 'Cancel',
                onClick: () => {
                  dispatch({type: 'DISMISS_MODAL'});
                  dispatch({type: 'START_TICK'});
                },
              }
            ]}
          />
        ),
      });
    }
  });
}

module.exports = Game;
