// @flow

const config = {
  type: 'CELL',
  maxHold: 1,
  width: 1,
  height: 1,
};

const make = (
  position: Vector,
): Cell => {
  return {
    ...config,
    id: -1,
    position,
    holding: null,
  };
};

const render = (ctx, game, cell) => {
  ctx.save();
  ctx.fillStyle = "orange";
  ctx.fillRect(
    cell.position.x, cell.position.y,
    cell.width, cell.height,
  );
  ctx.restore();
};

module.exports = {
  config, make, render,
};
