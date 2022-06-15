// @flow

const {
  pickupEntity, putdownEntity,
} = require('./entityOperations');
const {
  add, subtract, vectorTheta, equals, scale,
} = require('bens_utils').vectors;
const {
  closeTo, thetaToDir,
} = require('bens_utils').helpers;

const entityStartCurrentAction = (
  game: Game, entity: Entity,
): void => {
  if (entity.actions.length == 0) return;
  const curAction = entity.actions[0];
  curAction.effectDone = true;

  switch (curAction.type) {
    case 'PICKUP': {
      pickupEntity(game, entity, curAction.payload);
      break;
    }
    case 'PUTDOWN':
      putdownEntity(game, entity);
      break;
    case 'MOVE_TURN':
      if (!closeTo(entity.theta, curAction.payload.nextTheta)) {
        entity.prevTheta = entity.theta;
        entity.theta = curAction.payload.nextTheta;
      }
      // fall-through
    case 'MOVE': {
      if (equals(entity.position, curAction.payload.nextPos)) break;
      doMove(game, entity, curAction.payload.nextPos);
      break;
    }
    case 'TURN':
      entity.prevTheta = entity.theta;
      entity.theta = curAction.payload.nextTheta;
      break;
    case 'WAIT':
      // placeholder
      break;
  }
};

//-------------------------------------------------------------------
// Action implementations
//-------------------------------------------------------------------

/**
 * returns true if it was able to do the move
 */
const doMove = (game: Game, entity: Entity, nextPos: Vector): boolean => {
  const isMoveLegal = canDoMove(game, entity, nextPos);

  const nextTheta = vectorTheta(subtract(entity.position, nextPos));

  if (isMoveLegal.result == false && isMoveLegal.reason == 'OUTSIDE_GRID') {
    cancelAction(game, entity);
    return false;
  }

  if (isMoveLegal.result == false && isMoveLegal.reason == 'BLOCKED') {
    cancelAction(game, entity);
    if (!isFacing(entity, nextPos)) {
      entity.actions.unshift(makeAction(game, entity, 'TURN', {nextTheta}));
      entityStartCurrentAction(game, entity);
    }
    return false;
  }

  // Don't do move if not facing position you want to go to
  const thetaDiff = Math.abs(nextTheta - entity.theta) % (2 * Math.PI);
  if (!isFacing(entity, nextPos)) {
    if (game.controlledEntity && game.controlledEntity.id == entity.id) {
      // enables turning in place off a single button press
      cancelAction(game, entity);
    }
    if (thetaDiff <= Math.PI / 2 + 0.1) {
      cancelAction(game, entity);
      entity.actions.unshift(makeAction(game, entity, 'MOVE_TURN', {nextTheta, nextPos}));
    } else {
      entity.actions.unshift(makeAction(game, entity, 'TURN', nextTheta));
    }
    entityStartCurrentAction(game, entity);
    return false;
  }

  entity.prevPosition = {...entity.position};
  entity.position = {...nextPos};

  return true;
}

const canDoMove = (game, entity, nextPos) => {
  // TODO: implement canDoMove
  return {result: true, reason: ''};
};

const isFacing = (entity: Entity, position: Vector): boolean => {
  const nextDir = thetaToDir(vectorTheta(subtract(entity.position, position)));
  return nextDir == thetaToDir(entity.theta);
}

//-------------------------------------------------------------------
// Action Queue
//-------------------------------------------------------------------

const makeAction = (
  game: Game, entity: Entity, actionType: string, payload: mixed
): EntityAction => {
  const config = entity;

  const action = {
    type: actionType,
    effectIndex: 0,
    ...config[actionType],
    index: 0,
    payload,
    effectDone: false,
  };

  return action;
}

const isActionTypeQueued = (
  entity: Entity, actionType: string,
  almostDone: boolean, // don't count as queued if the action < 1 frame from done
): boolean => {
  if (entity.actions == null) {
    return false;
  }
  for (const action of entity.actions) {
    if (action.type == actionType) {
      if (almostDone && action.duration <= 16) {
        continue;
      }
      return true;
    }
  }
  return false;
};

const cancelAction = (game: Game, entity: Entity): void => {
  if (entity.actions.length == 0) return;

  const curAction = entity.actions[0];
  switch (curAction.type) {
    case 'MOVE':
      entity.prevPosition = {...entity.position};
      break;
    case 'TURN':
      entity.prevTheta = entity.theta;
      break;
    case 'MOVE_TURN':
      entity.prevPosition = {...entity.position};
      entity.prevTheta = entity.theta;
      break;
  }

  entity.actions.shift();
};

//-------------------------------------------------------------------
// Action Queue
//-------------------------------------------------------------------

const getInterpolatedPosition = (entity): Vector => {
  if (!entity.actions) return entity.position;
  const action = entity.actions[0];

  let pos = {...entity.position};

  if (action == null) return pos;

  switch (action.type) {
    case 'MOVE_TURN':
    case 'MOVE': {
      const diff = subtract(entity.position, entity.prevPosition);
      const progress = action.index / action.duration;
      pos = add(entity.prevPosition, scale(diff, progress));
      break;
    }
  }
  return pos;
};

const getInterpolatedTheta = (entity: Entity) => {
  if (!entity.actions) return entity.theta;
  const action = entity.actions[0];
  let theta = entity.theta;
  if (action == null) return theta;

  switch (action.type) {
    case 'MOVE_TURN': {
      let diff = entity.theta - entity.prevTheta;
      if (Math.abs(diff) < 0.01) break;
      if (Math.abs(diff) > Math.PI) {
        const mult = diff < 0 ? 1 : -1;
        diff = mult * (2 * Math.PI - Math.abs(diff));
      }
      const progress = Math.min(1, (action.index * 3) / action.duration);
      theta = progress * diff + entity.prevTheta;
      break
    }
    case 'TURN': {
      let diff = entity.theta - entity.prevTheta;
      if (Math.abs(diff) > Math.PI) {
        const mult = diff < 0 ? 1 : -1;
        diff = mult * (2 * Math.PI - Math.abs(diff));
      }
      const progress = action.index / action.duration;
      theta = progress * diff + entity.prevTheta;
      break;
    }
  }
  return theta;
};

module.exports = {
  makeAction,
  isActionTypeQueued,
  entityStartCurrentAction,
  getInterpolatedPosition,
  getInterpolatedTheta,
};
