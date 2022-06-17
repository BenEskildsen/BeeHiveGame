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

  // NOTE: special case for creating with a held entity
  if (entity.holding) {
    if (entity.holding.id == -1 || !game.entities[entity.holding.id]) {
      addEntity(game, entity.holding);
    }
    entity.holding.position = null;
  }

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


module.exports = {
  addEntity,
  removeEntity,
  pickupEntity,
  putdownEntity,
};
