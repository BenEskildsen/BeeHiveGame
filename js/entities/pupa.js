// @flow

const config = {
  type: 'PUPA',
  width: 1,
  height: 1,
  isMaturing: true,
  maturationAge: 10 * 1000;
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

const render = (ctx, game, pupa) => {
  ctx.save();
  ctx.fillStyle = "white";
  ctx.fillRect(
    pupa.position.x, pupa.position.y,
    pupa.width, pupa.height,
  );
  ctx.restore();
}

module.exports = {
  config, make, render,
};
