// @flow

const {
  pickupEntity, putdownEntity,
} = require('./entityOperations');
const {
  add, subtract, vectorTheta, equals,
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


module.exports = {
  makeAction,
  isActionTypeQueued,
  entityStartCurrentAction,
};
