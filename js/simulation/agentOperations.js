// @flow

const {
  makeAction, isActionTypeQueued,
  entityStartCurrentAction,
} = require('../simulation/actionOperations');
const {addEntity} = require('../simulation/entityOperations');
const {
  oneOf, weightedOneOf, randomIn,
} = require('bens_utils').stochastic;
const {
  getNeighboringPositions,
  getNextPositionInPath,
  getEmptyCells,
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
      break;
    }
    case 'FEED_LARVA': {
      feedLarvaTask(game, bee);
      break;
    }
    case 'BUILD_CELL': {
      buildCellTask(game, bee);
      break;
    }
    case 'SCOUT': {
      scoutTask(game, bee);
      break;
    }
    case 'RETRIEVE_FOOD': {
      retrieveFoodTask(game, bee);
      break;
    }
  }
};


const standbyTask = (game, bee) => {
  if (Math.random() < 0) {
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
      // TODO: what to do if feeding larva fails because it was already fed
      bee.task = {type: 'STANDBY'};
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


const buildCellTask = (game, bee) => {
  if (bee.task.cellPos == null && Object.values(game.BLUEPRINT).length > 0) {
    bee.task.cellPos = oneOf(Object.values(game.BLUEPRINT)).position;
  }
  if (bee.task.cellPos != null) {
    if (equals(bee.position, bee.task.cellPos)) {
      bee.actions.push(makeAction(game, bee, 'BUILD'));
      bee.task = {type: 'STANDBY'};
    } else {
      const nextPos = getNextPositionInPath(bee.position, bee.task.cellPos);
      bee.actions.push(makeAction(game, bee, 'MOVE', {nextPos}));
    }
  } else {
    // no more blueprints
    bee.task = {type: 'STANDBY'};
  }

};


const scoutTask = (game, bee) => {
  if (bee.task.doneScouting) {
    if (bee.task.cellPos == null) {
      bee.task.cellPos = oneOf(Object.values(game.CELL)).position;
    }

    if (bee.task.cellPos != null) {
      const nextPos = getNextPositionInPath(bee.position, bee.task.cellPos);
      if (equals(nextPos, bee.task.cellPos)) {
        // TODO: make some sort of tracking of food locations and assign here
        bee.task = {type: 'STANDBY'};
      } else {
        bee.actions.push(makeAction(game, bee, 'MOVE', {nextPos}));
      }
    }
  } else {

    if (bee.task.scoutPos == null) {
      const y = randomIn(0, game.gridHeight);
      const x = y % 2 == 0 ? game.gridWidth : game.gridWidth + 0.5;
      bee.task.scoutPos = {x, y};
    }

    if (bee.task.scoutPos != null) {
      if (equals(bee.position, bee.task.scoutPos)) {
        bee.actions.push(makeAction(game, bee, 'SCOUT'));
      } else {
        const nextPos = getNextPositionInPath(bee.position, bee.task.scoutPos);
        bee.actions.push(makeAction(game, bee, 'MOVE', {nextPos}));
      }
    }

  }
};


const retrieveFoodTask = (game, bee) => {
  // go out
  if (!bee.holding) {
    // TODO: foodPos should be assigned when the task gets assigned
    if (bee.task.foodPos == null) {
      const y = randomIn(0, game.gridHeight);
      const x = y % 2 == 0 ? game.gridWidth : game.gridWidth + 0.5;
      bee.task.foodPos = {x, y};
    }
    if (bee.task.foodPos != null) {
      if (equals(bee.position, bee.task.foodPos)) {
        bee.actions.push(makeAction(game, bee, 'COLLECT_FOOD'));
      } else {
        const nextPos = getNextPositionInPath(bee.position, bee.task.foodPos);
        bee.actions.push(makeAction(game, bee, 'MOVE', {nextPos}));
      }
    }
  } else { // come back
    if (bee.task.cellPos == null) {
      const emptyCells = getEmptyCells(game);
      if (emptyCells.length > 0) {
        bee.task.cellPos = oneOf(emptyCells).position;
      } else {
        // TODO: what to do if there are no empty cells
      }
    }

    if (bee.task.cellPos != null) {
      const nextPos = getNextPositionInPath(bee.position, bee.task.cellPos);
      if (equals(nextPos, bee.task.cellPos)) {
        const nextTheta = vectorTheta(subtract(bee.position, nextPos));
        bee.actions.push(makeAction(game, bee, 'TURN', {nextTheta}));
        bee.actions.push(makeAction(game, bee, 'PUTDOWN'));
        // TODO: what to do if putting down honey fails because cell is occupied
        bee.task = {type: 'STANDBY'};
      } else {
        bee.actions.push(makeAction(game, bee, 'MOVE', {nextPos}));
      }
    }

  }
};

module.exports = {
  agentDecideAction,
};
