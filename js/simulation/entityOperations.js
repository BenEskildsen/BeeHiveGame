// @flow

const {Properties} = require('../entities/registry');

const addEntity = (game: Game, entity: Entity): Game => {
  entity.id = game.nextID++;
  game.entities[entity.id] = entity;

  // add to property-based memos
  for (const prop in Properties) {
    if (entity[prop]) {
      game[Properties[prop]] = entity;
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
      delete game[Properties[prop]];
    }
  }

  // remove from type-based memo
  delete game[entity.type][entity.id];

  return game;
};

const pickupEntity = (game: Game, entity: Entity) => {
 // TODO: placeholder
}

const putdownEntity = (game: Game, entity: Entity) => {
 // TODO: placeholder
}

module.exports = {
  addEntity,
  removeEntity,
  pickupEntity,
  putdownEntity,
};
