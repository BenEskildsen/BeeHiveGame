// @flow

const config = {
  type: 'HONEY',
  width: 1,
  height: 1,
  maxQuantity: 100,
};

const make = (
  quantity: ?number,
  position: ?Vector,
): Cell => {
  return {
    ...config,
    id: -1,
    position,
    theta: 0,
    quantity: quantity != null ? quantity : 100,
  };
};

const render = (ctx, game, honey) => {
  ctx.save();
  ctx.fillStyle = "#FFDAB9";
};

module.exports = {
  config, make, render,
};
