// @flow

const {
  makeAction, isActionTypeQueued,
  entityStartCurrentAction,
} = require('../simulation/actionOperations');
const {oneOf, weightedOneOf} = require('bens_utils').stochastic;
const {
  getNeighboringPositions,
} = require('../selectors');

const agentDecideAction = (game, agent) => {
  if (game.controlledEntity && game.controlledEntity.id == agent.id) return;

  if (agent.type != 'BEE') {
    return; // placeholder
  }
  const bee = agent;
  switch (bee.task.type) {
    case 'STANDBY': {
      if (Math.random() < 0.85) {
        bee.actions.push(makeAction(game, bee, 'WAIT', {}));
      } else {
        const nextPos = oneOf(getNeighboringPositions(game, bee));
        bee.actions.push(makeAction(game, bee, 'MOVE', {nextPos}));
      }
    }
    case 'FEED_LARVA': {
      // TODO: implement feed larva task
    }
    case 'BUILD_CELL': {
      // TODO: implement build cell task
    }
    case 'SCOUT': {
      // TODO: implement scout task
    }
    case 'RETRIEVE_FOOD': {
      // TODO: implement retrieve food task
    }
  }
};

module.exports = {
  agentDecideAction,
};
