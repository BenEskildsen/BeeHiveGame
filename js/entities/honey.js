// @flow

const config = {
  type: 'HONEY',
  width: 1,
  height: 1,
};

const make = (
  heldIn: Entity,
): Cell => {
  return {
    ...config,
    id: -1,
    position: null,
    theta: 0,
    heldIn,
  };
};

const render = (ctx, game, honey) => {
  ctx.save();
  ctx.fillStyle = "orange";
  ctx.fillRect(
    honey.position.x, honey.position.y,
    honey.width, honey.height,
  );
  ctx.restore();
};

module.exports = {
  config, make, render,
};
