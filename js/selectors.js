// @flow

const {
  add, subtract, vectorTheta, equals, scale,
} = require('bens_utils').vectors;
const {encodePosition} = require('bens_utils').helpers;

const getPositionInFront = (game, entity) => {
  const dir = thetaToDir(entity.theta);
  return add(entity.position, getPositionInDir(dir));
};

const getPositionInDir = (dir) => {
  switch (dir) {
    case 'left':
      return {x: -1, y: 0};
    case 'upleft':
      return {x: -0.5, y: -1};
    case 'upright':
      return {x: 0.5, y: -1};
    case 'right':
      return {x: 1, y: 0};
    case 'downright':
      return {x: 0.5, y: 1};
    case 'downleft':
      return {x: -0.5, y: 1};
  }
}

const getNeighboringPositions = (game, entity) => {
  return [
    add(entity.position, {x: -1, y: 0}),
    add(entity.position, {x: -0.5, y: -1}),
    add(entity.position, {x: 0.5, y: -1}),
    add(entity.position, {x: 1, y: 0}),
    add(entity.position, {x: 0.5, y: 1}),
    add(entity.position, {x: -0.5, y: 1}),
  ];
};


const getCellInFront = (game, entity) => {
  const pos = getPositionInFront(game, entity);
  for (const e of game.grid[encodePosition(pos)]) {
    if (e.type == 'CELL') {
      return e;
    }
  }
  return null;
};


const getEmptyCells = (game) => {
  const emptyCells = [];
  for (const cellID in game.CELL) {
    if (game.CELL[cellID].holding == null) {
      emptyCells.push(game.CELL[cellID]);
    }
  }
  return emptyCells;
};


const getNextPositionInPath = (currentPos, targetPos) => {
  const diff = subtract(currentPos, targetPos);
  const theta = vectorTheta(diff);
  const dir = thetaToDir(theta);
  return add(currentPos, getPositionInDir(dir));
};


const onScreen = (game, entity) => {
  let {viewPos, viewWidth, viewHeight, gridWidth, gridHeight} = game;
  const {position, width, height} = entity;
  const {x, y} = position;

  const onScreen = (x + width) >= viewPos.x - 1 &&
    (y + height) >= viewPos.y - 1 &&
    x <= viewWidth + viewPos.x + 1 &&
    y <= viewHeight + viewPos.y + 1;

  const inWorld =
    x >= 0 && x < gridWidth &&
    y >= 0 && y < gridHeight;

  return onScreen && inWorld;
};


const isFacing = (entity: Entity, position: Vector): boolean => {
  const nextDir = thetaToDir(vectorTheta(subtract(entity.position, position)));
  return nextDir == thetaToDir(entity.theta);
}


// supersedes thetaToDir from the bens_utils package since we're working with a
// hex grid
const thetaToDir = (theta) => {
  const directions = ['left', 'upleft', 'upright', 'right', 'downright', 'downleft'];
  let deg = Math.round(theta * 180 / Math.PI);
  if (deg < 0) deg += 360;
  return directions[Math.round(deg / 60) % 6];
};


const getInterpolatedPosition = (entity): Vector => {
  if (!entity.actions) return entity.position;
  const action = entity.actions[0];

  let pos = {...entity.position};

  if (action == null) return pos;

  switch (action.type) {
    case 'MOVE_TURN':
    case 'MOVE': {
      const diff = subtract(entity.position, entity.prevPosition);
      const progress = action.index / action.duration;
      pos = add(entity.prevPosition, scale(diff, progress));
      break;
    }
  }
  return pos;
};

const getInterpolatedTheta = (entity: Entity) => {
  if (!entity.actions) return entity.theta;
  const action = entity.actions[0];
  let theta = entity.theta;
  if (action == null) return theta;

  switch (action.type) {
    case 'MOVE_TURN': {
      let diff = entity.theta - entity.prevTheta;
      if (Math.abs(diff) < 0.01) break;
      if (Math.abs(diff) > Math.PI) {
        const mult = diff < 0 ? 1 : -1;
        diff = mult * (2 * Math.PI - Math.abs(diff));
      }
      const progress = Math.min(1, (action.index * 3) / action.duration);
      theta = progress * diff + entity.prevTheta;
      break
    }
    case 'TURN': {
      let diff = entity.theta - entity.prevTheta;
      if (Math.abs(diff) > Math.PI) {
        const mult = diff < 0 ? 1 : -1;
        diff = mult * (2 * Math.PI - Math.abs(diff));
      }
      const progress = action.index / action.duration;
      theta = progress * diff + entity.prevTheta;
      break;
    }
  }
  return theta;
};

const exports = {
  getPositionInFront,
  getCellInFront,
  getEmptyCells,
  getNextPositionInPath,
  getNeighboringPositions,
  onScreen,
  isFacing,
  thetaToDir,
  getInterpolatedPosition,
  getInterpolatedTheta,
};

window.selectors = exports;
module.exports = exports;
