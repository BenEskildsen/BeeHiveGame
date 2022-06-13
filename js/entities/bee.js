// @flow

const config = {
  type: 'BEE',

  width: 1,
  height: 1,
  maxHold: 1,
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
};

const make = (
  position: Vector,
): Bee => {
  return {
    ...config,
    position,
    theta: 0,
    id: -1, // NOTE: this should be set by the reducer
    actions: [],
    holding: null,
    holdingIDs: [], // treat holding like a stack
    role: null,
    task: 'WANDER',
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

  ctx.restore();
};

module.exports = {config, make, render};
