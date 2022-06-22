// @flow

const React = require('react');
const {Button, Canvas, Modal} = require('bens_ui_components');
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
