// @flow

const {
  makeAction, isActionTypeQueued,
  entityStartCurrentAction,
} = require('../simulation/actionOperations');
const {oneOf, weightedOneOf} = require('bens_utils').stochastic;
const {
  getNeighboringPositions,
  getNextPositionInPath,
} = require('../selectors');
const {
  equals, vectorTheta, add, subtract, scale,
} = require('bens_utils').vectors;

const agentDecideAction = (game, agent) => {
  if (game.controlledEntity && game.controlledEntity.id == agent.id) return;

  if (agent.type != 'BEE') {
    return; // placeholder
  }
  const bee = agent;
  switch (bee.task.type) {
    case 'STANDBY': {
      standbyTask(game, bee);
    }
    case 'FEED_LARVA': {
      feedLarvaTask(game, bee);
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


const standbyTask = (game, bee) => {
  if (Math.random() < 0.85) {
    bee.actions.push(makeAction(game, bee, 'WAIT'));
  } else {
    const nextPos = oneOf(getNeighboringPositions(game, bee));
    bee.actions.push(makeAction(game, bee, 'MOVE', {nextPos}));
  }
};


const feedLarvaTask = (game, bee) => {
  // if holding honey then take it to a larva
  if (bee.holding && bee.holding.type == 'HONEY') {
    // select larva to feed
    if (bee.task.larvaPos == null && Object.keys(game.LARVA).length > 0) {
      bee.task.larvaPos = oneOf(Object.values(game.LARVA)).heldIn.position;
    } else if (Object.keys(game.LARVA).length == 0) {
      // TODO: for feeding larva - might be no larva or no larva in a cell
      bee.actions.push(makeAction(game, bee, 'WAIT'));
      return;
    }
    // feed the larva if you're at it or else move towards it
    const nextPos = getNextPositionInPath(bee.position, bee.task.larvaPos);
    if (equals(nextPos, bee.task.larvaPos)) {
      const nextTheta = vectorTheta(subtract(bee.position, nextPos));
      bee.actions.push(makeAction(game, bee, 'TURN', {nextTheta}));
      bee.actions.push(makeAction(game, bee, 'PUTDOWN'));
      // TODO: what to do when done feeding larva
      bee.task.foodPos = null;
      bee.task.larvaPos = null;
      // bee.task = {type: 'STANDBY'};
    } else {
      bee.actions.push(makeAction(game, bee, 'MOVE', {nextPos}));
    }
  } else if (!bee.holding) {
    // select honey to pick up
    if (bee.task.foodPos == null && Object.keys(game.HONEY).length > 0) {
      bee.task.foodPos = oneOf(Object.values(game.HONEY)).heldIn.position;
    } else if (Object.keys(game.HONEY).length == 0) {
      // TODO: for feeding larva - what to do if there's no honey
      bee.actions.push(makeAction(game, bee, 'WAIT'));
      return;
    }
    // pick up the honey if you're at it or else move towards it
    const nextPos = getNextPositionInPath(bee.position, bee.task.foodPos);
    if (equals(nextPos, bee.task.foodPos)) {
      const nextTheta = vectorTheta(subtract(bee.position, nextPos));
      bee.actions.push(makeAction(game, bee, 'TURN', {nextTheta}));
      bee.actions.push(makeAction(game, bee, 'PICKUP'));
    } else {
      bee.actions.push(makeAction(game, bee, 'MOVE', {nextPos}));
    }
  }
  // TODO: handle if bee is holding something other than honey in feed larva

};

module.exports = {
  agentDecideAction,
};
