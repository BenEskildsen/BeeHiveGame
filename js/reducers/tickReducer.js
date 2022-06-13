// @flow

const {
  removeEntity, addEntity,
} = require('../simulation/entityOperations');
const {
  makeAction, isActionTypeQueued,
  entityStartCurrentAction,
} = require('../simulation/actionOperations');
const {
  add, subtract, equals, vectorTheta,
} = require('bens_utils').vectors;
const {
  closeTo,
} = require('bens_utils').helpers;
const {render} = require('../render');
const {Entities} = require('../entities/registry');

const MS_PER_TICK = 16;

let totalTime = 0;
const tickReducer = (game: Game, action: Action): GameState => {
  switch (action.type) {
    case 'START_TICK': {
      if (game != null && game.tickInterval != null) {
        return game;
      }

      game.prevTickTime = new Date().getTime();

      return {
        ...game,
        tickInterval: setInterval(
          // HACK: store is only available via window
          () => store.dispatch({type: 'TICK'}),
          MS_PER_TICK,
        ),
      };
    }
    case 'STOP_TICK': {
      clearInterval(game.tickInterval);
      game.tickInterval = null;

      return game;
    }
    case 'TICK': {
      return doTick(game);
    }
  }
  return game;
};

//////////////////////////////////////////////////////////////////////////
// Do Tick
//////////////////////////////////////////////////////////////////////////
const doTick = (game: Game): Game => {
  const curTickTime = new Date().getTime();

	game.time += 1;

  // initializations:
  if (game.time == 1) {
    game.prevTickTime = new Date().getTime();
    game.controlledEntity = game.BEE[2];
    // game.focusedEntity = base;
  }

  // game/frame timing
  game.timeSinceLastTick = curTickTime - game.prevTickTime;

  // these are the ECS "systems"
  keepControlledMoving(game);
  updateActors(game);
  // updateAgents(game);
  // updateViewPos(game, false /*don't clamp to world*/);

  render(game);

  // update timing frames
  game.totalGameTime += curTickTime - game.prevTickTime;
  game.prevTickTime = curTickTime;

  return game;
};

//////////////////////////////////////////////////////////////////////////
// Updating Agents
//////////////////////////////////////////////////////////////////////////

const updateActors = (game): void => {
  let fn = () => {}

  for (const id in game.ACTOR) {
    const actor = game.entities[id];
    if (
      actor == null ||
      actor.actions == null ||
      actor.actions.length == 0
    ) {
      continue;
    }

    if (actor.isAgent) {
      // fn = agentDecideAction;
    }
    stepAction(game, actor, fn);
  }
}

const updateAgents = (game): void => {
	for (const id in game.AGENT) {
    const agent = game.entities[id];
    agent.age += game.timeSinceLastTick;
    agent.timeOnTask += game.timeSinceLastTick;

    if (agent.actions.length == 0) {
      agentDecideAction(game, agent);
    }
	}
}

//////////////////////////////////////////////////////////////////////////
// Move controlledEntity/View
//////////////////////////////////////////////////////////////////////////

/**
 * If the queen isn't moving but you're still holding the key down,
 * then just put a move action back on the action queue
 */
const keepControlledMoving = (game: Game): void => {
  const controlledEntity = game.controlledEntity;
  if (!controlledEntity) return;
  const moveDir = {x: 0, y: 0};
  if (game.hotKeys.keysDown.up) {
    moveDir.y += 1;
  }
  if (game.hotKeys.keysDown.down) {
    moveDir.y -= 1;
  }
  if (game.hotKeys.keysDown.left) {
    moveDir.x -= 1;
  }
  if (game.hotKeys.keysDown.right) {
    moveDir.x += 1;
  }
  if (!equals(moveDir, {x: 0, y: 0})) {
    controlledEntity.timeOnMove += 1;
  } else {
    controlledEntity.timeOnMove = 0;
  }

  if (
    !equals(moveDir, {x: 0, y: 0}) && !isActionTypeQueued(controlledEntity, 'MOVE', true)
    && !isActionTypeQueued(controlledEntity, 'MOVE_TURN', true)
    && !isActionTypeQueued(controlledEntity, 'TURN') // enables turning in place
  ) {
    const nextPos = add(controlledEntity.position, moveDir);
    const nextTheta = vectorTheta(subtract(controlledEntity.position, nextPos));
    let entityAction = makeAction(
      game, controlledEntity, 'MOVE', {nextPos},
    );
    if (!closeTo(nextTheta, controlledEntity.theta)) {
      if (controlledEntity.timeOnMove > 1) {
        entityAction = makeAction(
          game, controlledEntity, 'MOVE_TURN',
          {
            nextPos,
            nextTheta,
          },
        );
        controlledEntity.prevTheta = controlledEntity.theta;
      } else {
        entityAction = makeAction(
          game, controlledEntity, 'TURN', {nextTheta},
        );
      }
    }
    controlledEntity.timeOnMove = 0;
    controlledEntity.actions.push(entityAction);
  }
}

const updateViewPos = (
  game: Game,clampToGrid: boolean,
): void => {
  let nextViewPos = {...game.viewPos};
  const focusedEntity = game.focusedEntity;
  if (focusedEntity) {
    const moveDir = subtract(focusedEntity.position, focusedEntity.prevPosition);
    const action = focusedEntity.actions[0];
    if (
      action != null &&
      (action.type == 'MOVE' || action.type == 'DASH' || action.type == 'MOVE_TURN')
    ) {
      const index = getInterpolatedIndex(game, focusedEntity);
      const duration = getDuration(game, focusedEntity, action.type);
      nextViewPos = add(
        nextViewPos,
        scale(moveDir, game.timeSinceLastTick/duration),
      );
    } else if (action == null) {
      const idealPos = {
        x: focusedEntity.position.x - game.viewWidth / 2,
        y: focusedEntity.position.y - game.viewHeight /2,
      };
      const diff = subtract(idealPos, nextViewPos);
      // NOTE: this allows smooth panning to correct view position
      const duration = getDuration(game, focusedEntity, 'MOVE');
      nextViewPos = add(nextViewPos, scale(diff, 16/duration));
    }
  }

  nextViewPos = {
    x: Math.round(nextViewPos.x * 100) / 100,
    y: Math.round(nextViewPos.y * 100) / 100,
  };

  if (!clampToGrid) {
    if (!equals(game.viewPos, nextViewPos)) {
      game.viewPos = nextViewPos;
    }
  } else {
    game.viewPos = {
      x: clamp(nextViewPos.x, 0, game.gridWidth - game.viewWidth),
      y: clamp(nextViewPos.y, 0, game.gridHeight - game.viewHeight),
    };
  }
}

//////////////////////////////////////////////////////////////////////////
// Doing Actions
//////////////////////////////////////////////////////////////////////////

const stepAction = (
  game: Game, entity: Entity, decisionFunction: mixed,
): void => {
  if (entity.actions == null || entity.actions.length == 0) return;

  let curAction = entity.actions[0];

  if (curAction.index >= curAction.effectIndex && !curAction.effectDone) {
    entityStartCurrentAction(game, entity);
    curAction = entity.actions[0]; // curAction could change if it
                                   // was cancelled and replaced
  } else if (curAction.index >= curAction.duration) {
    const prevAction = entity.actions.shift();
    curAction = entity.actions[0];
    if (curAction == null) {
      decisionFunction(game, entity);
      curAction = entity.actions[0];
    }
    if (curAction != null && curAction.effectIndex == 0) {
      entityStartCurrentAction(game, entity);
    }
  }

  if (curAction != null) {
    curAction.index += game.timeSinceLastTick;
  }
}

//////////////////////////////////////////////////////////////////////////
// Misc.
//////////////////////////////////////////////////////////////////////////

module.exports = {tickReducer};
