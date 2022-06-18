// @flow

const config = {
  type: 'LARVA',
  width: 1,
  height: 1,
};

const make = (heldIn: Entity) => {
  return {
    ...config,
    id: -1,
    position: null,
    theta: 0,
    age: 0,
    heldIn,
  };
}

const render = (ctx, game, larva) => {
  ctx.save();
  ctx.fillStyle = "white";
  ctx.fillRect(
    larva.position.x, larva.position.y,
    larva.width, larva.height,
  );
  ctx.restore();
}

module.exports = {
  config, make, render,
};
