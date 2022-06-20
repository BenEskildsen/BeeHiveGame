// @flow

const {Entities, Properties} = require('./entities/registry');
const {
  onScreen,
  getInterpolatedPosition,
  getInterpolatedTheta,
} = require('./selectors');

let cur = null;
let prevTime = 0;
let msAvg = 0;
const weightRatio = 0.1;
const render = (game: Game): void => {
  window.requestAnimationFrame((timestamp) => {
    const curTime = new Date().getTime();

    // don't call renderFrame multiple times on the same timestamp
    if (timestamp == cur) {
      return;
    }
    cur = timestamp;

    if (prevTime > 0) {
      msAvg = msAvg * (1 - weightRatio) + (curTime - prevTime) * weightRatio;
    }
    // console.log(1 / (msAvg / 1000));

    renderFrame(game);

    prevTime = curTime;
  });
}

let canvas = null;
let ctx = null;
const renderFrame = (game: Game): void => {
  canvas = document.getElementById('canvas');
  if (!canvas) return; // don't break
  ctx = canvas.getContext('2d');
  if (!ctx) return;

  const canvasWidth = window.innerWidth;
  const canvasHeight = window.innerHeight;

  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  const dims = {
    viewWidth: game.viewWidth,
    viewHeight: game.viewHeight,
    viewPos: {...game.viewPos},
    pxWidth: canvasWidth / game.viewWidth,
    pxHeight: canvasHeight / game.viewHeight,
  };
  renderView(canvas, ctx, game, dims);
};

const renderView = (canvas, ctx, game, dims): void => {
  const {pxWidth, pxHeight, viewWidth, viewHeight, viewPos} = dims;

	const px = viewWidth / pxWidth;
  const pxy = viewHeight / pxHeight;

  // scale world to the canvas
  ctx.save();
  ctx.scale(
    pxWidth,
    pxHeight,
  );
  ctx.lineWidth = px;

  // rotate
  // ctx.translate(viewPos.x + viewWidth / 2, viewPos.y + viewHeight / 2);
  // ctx.rotate(Math.PI / 4);
  // ctx.translate(-viewWidth / 2, -viewHeight / 2);

  ctx.translate(-1 * viewPos.x, -1 * viewPos.y);

  // render entities
  for (const entityType in Entities) {
    for (const id in game[entityType]) {
      const entity = game.entities[id];
      renderEntity(
        ctx, game,
        {
          ...entity,
          position: getInterpolatedPosition(entity),
          theta: getInterpolatedTheta(entity),
        },
      );
    }
  }
  ctx.restore();
};

const renderEntity = (ctx, game, entity) => {
  if (entity == null || entity.position == null) return;

  if (!onScreen(game, entity)) {
    return;
  }

  Entities[entity.type].render(ctx, game, entity);
};


module.exports = {render};
