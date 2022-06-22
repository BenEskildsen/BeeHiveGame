// @flow

const {subtract} = require('bens_utils').vectors;
const {getPositionInFront} = require('../selectors');

const config = {
  type: 'BEE',

  width: 1,
  height: 1,
  age: 0,

  isActor: true,
  isAgent: true,
  // action params
  MOVE: {
    duration: 45 * 4,
    spriteOrder: [],
  },
  TURN: {
    duration: 45 * 6,
    spriteOrder: [],
  },
  MOVE_TURN: {
    duration: 45 * 5,
    spriteOrder: [],
  },
  PICKUP: {
    duration: 45 * 4,
    spriteOrder: [],
  },
  PUTDOWN: {
    duration: 45 * 4,
    spriteOrder: [],
  },
  LAY_EGG: {
    duration: 45 * 7,
    effectIndex: 3 * 45,
    spriteOrder: [],
  },
  WAIT: {
    duration: 45 * 4,
    spriteOrder: [],
  },
};

export type Task =
  {type: 'STANDBY'} |
  {type: 'FEED_LARVA', foodPos: Vector, larvaPos: Vector} |
  {type: 'BUILD_CELL', cellPos: Vector} |
  {type: 'SCOUT', scoutPos: Vector, timeOffScreen: number} |
  {type: 'RETRIEVE_FOOD', foodPos: Vector, timeOffScreen: number};

const make = (
  position: Vector,
): Bee => {
  return {
    ...config,
    prevPosition: position,
    position,
    theta: 0,
    id: -1, // NOTE: this should be set by the reducer
    actions: [],
    holding: null,
    task: {type: 'FEED_LARVA'},
    dance: null,
  };
}

const render = (ctx, game: Game, bee: Bee) => {
  const {x, y} = bee.position;
  const {width, height, theta} = bee;

  ctx.save();

  // rotate
  ctx.translate(x +  width / 2, y + height / 2);
  ctx.rotate(theta - Math.PI / 2);
  ctx.translate(-width / 2, -height / 2);

  // draw
  ctx.fillStyle = 'yellow';
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, width / 4, height / 4); // left eye
  ctx.fillRect(3 * width / 4, 0, width / 4, height / 4); // right eye
  ctx.fillRect(3 * width / 8, 3 * height / 4, width / 4, height / 2); // stinger

  // holding
  if (bee.holding) {
    ctx.lineWidth = 0.1;
    if (bee.holding.type == 'HONEY') {
      ctx.fillStyle = "orange";
      ctx.strokeStyle = 'white';
      ctx.fillRect(width / 3, 0, width / 3, height / 4); // left eye
    }
    if (bee.holding.type == 'EGG') {
      ctx.fillStyle = 'white';
      ctx.strokeStyle = 'white';
      ctx.beginPath();
      ctx.arc(width / 2, 0, 0.2, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.stroke();
    }
    if (bee.holding.type == 'LARVA') {
      ctx.fillStyle = 'white';
      ctx.strokeStyle = 'white';
      ctx.beginPath();
      ctx.arc(width / 2, 0, 0.34, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.stroke();
      ctx.fill();
    }
  }

  ctx.restore();


  // space in front
  if (game.controlledEntity && game.controlledEntity.id == bee.id) {
    ctx.save();

    const pos = getPositionInFront(game, bee);
    // const pos = subtract(bee.position, posInFront);
    const cellWidth = 1;
    const cellHeight = 1;
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 0.03;
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    ctx.lineTo(pos.x + cellWidth / 2, pos.y - cellHeight / 3);
    ctx.lineTo(pos.x + cellWidth, pos.y);
    ctx.lineTo(pos.x + cellWidth, pos.y + cellHeight * 0.666);
    ctx.lineTo(pos.x + cellWidth / 2, pos.y + cellHeight * 0.666 + cellHeight / 3);
    ctx.lineTo(pos.x, pos.y + cellHeight * 0.666);

    ctx.closePath();
    ctx.stroke();

    ctx.restore();
  }
};

module.exports = {config, make, render};
