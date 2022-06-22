// @flow

const config = {
  type: 'EGG',
  width: 1,
  height: 1,
  isMaturing: true,
  maturationAge: 5 * 1000,
};

const make = (heldIn: Entity) => {
  return {
    ...config,
    id: -1,
    position: null,
    heldIn,
    theta: 0,
    age: 0,
  };
}

const render = (ctx, game, egg) => {
  ctx.save();
  ctx.fillStyle = "white";
  ctx.fillRect(
    egg.position.x, egg.position.y,
    egg.width, egg.height,
  );
  ctx.restore();
}

module.exports = {
  config, make, render,
};
