// @flow

const {Entities} = require('../entities/registry');
const {addEntity} = require('../simulation/entityOperations');

const entityReducer = (game: Game, action: Action): Game => {
  switch (action.type) {
    case 'CREATE_ENTITY': {
      const {entityType, args} = action;
      const {make} = Entities[entityType];
      const entity = make(...args);
      addEntity(game, entity);
      return game;
    }
    case 'QUEUE_ACTION': {
      const {entityAction, entity} = action;
      entity.actions.push(entityAction);
      return game;
    }
  }

  return game;
};

module.exports = {entityReducer};
