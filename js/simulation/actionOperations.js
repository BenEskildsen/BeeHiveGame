// @flow

const {
  pickupEntity, putdownEntity, addEntity,
} = require('./entityOperations');
const {
  add, subtract, vectorTheta, equals, scale,
} = require('bens_utils').vectors;
const {
  closeTo,
  // thetaToDir, // NOTE: not using because we're in a hex grid
} = require('bens_utils').helpers;
const {isFacing, thetaToDir, getCellInFront} = require('../selectors');
const {Entities} = require('../entities/registry');

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
        rotateEntity(game, entity, curAction.payload.nextTheta);
      }
      // fall-through
    case 'MOVE': {
      if (equals(entity.position, curAction.payload.nextPos)) break;
      doMove(game, entity, curAction.payload.nextPos);
      break;
    }
    case 'TURN':
      // TODO: turning left will briefly say couldn't find position in front for some reason
      rotateEntity(game, entity, curAction.payload.nextTheta);
      break;
    case 'WAIT':
      // placeholder
      break;
    case 'LAY_EGG':
      layEgg(game, entity);
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
      stackAction(game, entity, makeAction(game, entity, 'TURN', {nextTheta}));
    }
    entityStartCurrentAction(game, entity);
    return false;
  }

  // Do the move
  entity.prevPosition = {...entity.position};
  entity.position = {...nextPos};
  // TODO: move should check for inGrid entities

  return true;
}

const canDoMove = (game, entity, nextPos) => {
  // TODO: implement canDoMove
  return {result: true, reason: ''};
};

const rotateEntity = (game, entity, nextTheta) => {
  entity.prevTheta = entity.theta;
  entity.theta = nextTheta;
}

const layEgg = (game, entity) => {
  const targetCell = getCellInFront(game, entity);
  if (!targetCell) return false;
  if (targetCell.holding) return false;
  const egg = Entities.EGG.make(targetCell);
  addEntity(game, egg);
  targetCell.holding = egg;
  return true;
};

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
    payload: payload == null ? {} : payload,
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

const stackAction = (game, entity, action) => {
  entity.actions[0].index = 0;
  entity.actions[0].effectDone = false;
  entity.actions.unshift(action);
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
