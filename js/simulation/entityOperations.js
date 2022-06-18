// @flow

const {Properties} = require('../entities/registry');
const {getCellInFront} = require('../selectors');
const {encodePosition} = require('bens_utils').helpers;

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

  // NOTE: special case for entities in the grid
  if (entity.inGrid && entity.position) {
    game.grid[encodePosition(entity.position)].push(entity);
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

  // NOTE: special case for entities in the grid
  if (entity.inGrid && entity.position) {
    let nextEntities = [];
    for (const e of game.grid[encodePosition(entity.position)]) {
      if (e.id != entity.id) {
        nextEntities.push(e);
      }
    }
    game.grid[encodePosition(entity.position)] = nextEntities;
  }

  return game;
};

// -----------------------------------------------------------------------
// Pick up / put down
// -----------------------------------------------------------------------

const pickupEntity = (game: Game, entity: Entity): boolean => {
  if (!entity) return false;
  if (entity.holding) return false;

  const targetCell = getCellInFront(game, entity);
  if (!targetCell) return false;
  if (!targetCell.holding) return false;

  entity.holding = targetCell.holding;
  targetCell.holding = null;
  return true;
}

const putdownEntity = (game: Game, entity: Entity): boolean => {
  if (!entity) return false;
  if (!entity.holding) return false;

  const targetCell = getCellInFront(game, entity);
  if (!targetCell) return false;
  if (targetCell.holding) {
    // NOTE: special case for feeding larva
    if (targetCell.holding.type == 'LARVA' && entity.holding.type == 'HONEY') {
      const pupa = Entities.PUPA.make(targetCell);
      addEntity(game, pupa);
      removeEntity(game, targetCell.holding);
      targetCell.holding = pupa;

      entity.holding = null;
      return true;
    }
    return false;
  }

  targetCell.holding = entity.holding;
  entity.holding = null;
  return true;
}


module.exports = {
  addEntity,
  removeEntity,
  pickupEntity,
  putdownEntity,
};
