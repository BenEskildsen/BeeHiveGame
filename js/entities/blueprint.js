// @flow

const config = {
  type: 'BLUEPRINT',
  inGrid: true,
  width: 1,
  height: 1,
};

const make = (
  position: Vector,
) => {
  return {
    ...config,
    id: -1,
    position,
    theta: 0,
  };
};

const render = (ctx, game, blueprint) => {
  ctx.save();
  ctx.fillStyle = "rgba(0, 100, 0, 0.3";
  ctx.strokeStyle = 'blue';

  const {x, y} = blueprint.position;
  const {width, height} = blueprint;
  ctx.lineWidth = 0.1;

  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + width / 2, y - height / 3);
  ctx.lineTo(x + width, y);
  ctx.lineTo(x + width, y + height * 0.666);
  ctx.lineTo(x + width / 2, y + height * 0.666 + height / 3);
  ctx.lineTo(x, y + height * 0.666);

  ctx.closePath();
  ctx.stroke();
  ctx.fill();

  ctx.restore();
};

module.exports = {config, make, render};
