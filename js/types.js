// @flow

type Vector = {x: number, y: number};
type EntityID = String;

// an action is a thing that takes time
type Action = {
  type: String,
  duration: number,
  index: number,
  spriteOrder: Array<number>, // order in spritesheet
};

// an entity is a thing in the game
// not all entities need all properties
type Entity = {
  id: EntityID,
  type: String,

  // entities with a position
  position: Vector,
  theta: number,
  width: number,
  height: number,

  // entities that do actions
  actions: Array<Action>,
};

type Cell = Entity & {
  type: 'CELL',
  holding: ?Entity,
}

type Bee = Entity & {
  dance: ?Dance,
  holding: ?Entity,
  role: String,
  task: String,
}

type Dance = {
  actions: Array<Action>,
}

type Game = {
  time: number,
  tickInterval: any,
  entities: {[EntityID]: Entity},

  // view
  viewWidth: number,
  viewHeight: number,
  viewPos: Vector,

  gridWidth: number,
  gridHeight: number,

};
