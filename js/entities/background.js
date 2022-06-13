// @flow

const config = {
  type: 'BACKGROUND',
};

const make = (
  position: Vector,
  width: number,
  height: number,
  parallaxLevel: number,
): Background => {
  return {
    ...config,
    id: -1,
    position,
    width,
    height,
    parallaxLevel,
  };
};

const render = (ctx, game, background) => {
  ctx.save();
  ctx.fillStyle = "steelblue";
  ctx.fillRect(
    background.position.x, background.position.y,
    background.width, background.height,
  );
  ctx.restore();
};

module.exports = {
  config, make, render,
};
