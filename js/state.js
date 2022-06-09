// @flow

const initState = (): State => {
  return {
    screen: 'LOBBY',
    game: null,
    isMuted: true,
  };
};

const initGameState: (): Game => {
  const game = {
    time: 0,
    tickInterval: null,
    level: string,

    viewWidth: 50,
    viewHeight: 50,
    viewPos: {x: 0, y: 0};

    gridWidth: 50,
    gridHeight: 50,

    nextID: 1
    entities: {},
    // memoized "system"-level properties
    AGENT: {}, // entities that do actions
    NOT_ANIMATED: {}, // entities that don't animate every tick
    MATURING: {}, // entities that mature over time into other entities
                  // eg egg -> larva -> pupa, nectar -> honey
  };
};

module.exports = {
  initState, initGameState,
};
