// @flow

const {Properties} = require('../entities/registry');

// -----------------------------------------------------------------------
// Adding and removing entities
// -----------------------------------------------------------------------

const addEntity = (game: Game, entity: Entity): Game => {
  entity.id = game.nextID++;
  game.entities[entity.id] = entity;

  // add to property-based memos
  for (const prop in Properties) {
    if (entity[prop]) {
      game[Properties[prop]][entity.id] = entity;
    }
  }

  // add to type-based memo
  game[entity.type][entity.id] = entity;

  return game;
};

const removeEntity = (game: Game, entity: Entity): Game => {
  delete game.entities[entity.id];

  // remove from property-based memos
  for (const prop in Properties) {
    if (entity[prop]) {
      delete game[Properties[prop]][entity.id];
    }
  }

  // remove from type-based memo
  delete game[entity.type][entity.id];

  return game;
};

// -----------------------------------------------------------------------
// Pick up / put down
// -----------------------------------------------------------------------

const pickupEntity = (game: Game, entity: Entity) => {
 // TODO: placeholder for picking up
}

const putdownEntity = (game: Game, entity: Entity) => {
 // TODO: placeholder for putting down
}

// -----------------------------------------------------------------------
// Actions
// -----------------------------------------------------------------------

const makeAction = (
  game: Game, entity: Entity, actionType: string, payload: mixed
): EntityAction => {
  const config = entity;

  const action = {
    type: actionType
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
}


module.exports = {
  addEntity,
  removeEntity,
  pickupEntity,
  putdownEntity,
  makeAction,
  isActionTypeQueued,
};
