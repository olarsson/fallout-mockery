export type DirectionChar = '+' | '-' | '/';
export type Facing = { x: DirectionChar; y: DirectionChar };
export type FacingKey = `${DirectionChar}${DirectionChar}`;

export type Cord = { x: number; y: number };

export type HexPosition = {
  PX: { x: number; y: number };
  CORD: Cord;
};

export type Weapon = {
  melee: boolean;
  range: number | null;
  damage: [number, number];
  actionPoints: number;
};

export type EntityState = -1 | 0 | 1 | 2 | 3;

export type SpriteSheetConfig = {
  imageKey: string;
  totalFrames?: number;
  countX: number;
  countY: number;
  width: number;
  height: number;
  clipX: number;
  clipY: number;
  offsetX: number;
  offsetY: number;
};

export type EntityAnimations = {
  still: SpriteSheetConfig;
  moving: SpriteSheetConfig;
  attack: SpriteSheetConfig;
  hit?: SpriteSheetConfig;
  death?: SpriteSheetConfig;
  dead?: SpriteSheetConfig;
};

export type AnimationController = {
  startTime: number | null;
  init(state: EntityState): void;
  finished(): void;
  movementAnimation: { start(): void; stop(): void };
  attackAnimation: { start(): void; stop(): void };
  hitAnimation?: { start(): void; stop(): void };
  deathAnimation?: { start(): void; stop(): void };
};

export type PlayerEntity = {
  id: '_player';
  DEFAULTS: { actionPoints: number; maxHealth: number };
  health: number;
  state: EntityState;
  actionPoints: number;
  moveCost: number;
  stopActions: boolean;
  weapon: Weapon;
  temp: { attackStep: number; haveBeenRun: boolean };
  animations: Pick<EntityAnimations, 'still' | 'moving' | 'attack' | 'hit'>;
  animation: AnimationController;
};

export type EnemyEntity = {
  id: string;
  alive: boolean;
  health: number;
  engaged: boolean;
  maxsteps: number;
  aggroRange: number;
  actionPoints: number;
  moveCost: number;
  DEFAULTS: { actionPoints: number };
  HEX: HexPosition;
  FACING: Facing;
  weapon: Weapon;
  state: EntityState;
  temp: { tempStep: number; haveBeenRun: boolean };
  animations: EntityAnimations;
  animation: AnimationController;
};

export type QueueEntry = { id: '_player' } | EnemyEntity;

export type CombatState = {
  inCombat: boolean;
  queuePos: number;
  queue: QueueEntry[];
};

export type TileType = 0 | 1 | 2 | 3 | 4;

export type TileQueryResult = {
  type: TileType;
  canMoveTo: boolean;
  enemy: boolean;
};

export type PathResult = {
  pathLength: number;
  isPathPossible: boolean;
};

export type PathDirection = {
  directionX: DirectionChar;
  directionY: DirectionChar;
};

export type MoveStep = {
  nextCords: Cord;
  pathDirection: PathDirection;
};

export type NextCordResult = {
  newCords: Cord;
  restricted: boolean;
};

export type PlayerPosition = {
  previousImgStep: number;
  moveCounter: number;
  FACING: Facing;
  HEX: HexPosition;
};

export type PointerPosition = {
  HEX: HexPosition;
};

export type RestrictedState = {
  dynamic: boolean;
  dynamicCords: Cord[];
  cords: Cord[];
};

export type ViewportArea = {
  x: number;
  y: number;
};

export type MapChunkCoord = { x: number; y: number };

export type EnemySnapshot = {
  id: string;
  alive: boolean;
  health: number;
  actionPoints: number;
  state: EntityState;
  facing: Facing;
  cord: Cord;
  temp: { tempStep: number; haveBeenRun: boolean };
};

export type ChunkSnapshot = {
  walls: Cord[];
  enemies: EnemySnapshot[];
};

export type MapState = {
  chunk: MapChunkCoord;
  visited: Record<string, ChunkSnapshot>;
};

export type GameState = {
  player: PlayerEntity;
  enemies: EnemyEntity[];
  combat: CombatState;
  gameOver: boolean;
  map: MapState;
  positions: {
    mousePointer: PointerPosition;
    clickPos: PointerPosition;
    playerPos: PlayerPosition;
  };
  restricted: RestrictedState;
  viewport: ViewportArea;
  cursorType: TileType;
  pathPreview: Cord[];
};

export type GameContext = {
  state: GameState;
  hexGrid: import('@/grid/HexGrid').HexGrid;
  scheduler: import('@/systems/ActionScheduler').ActionScheduler;
  barCanvas: HTMLCanvasElement;
};
