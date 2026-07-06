import { HEX_RADIUS } from '@/core/constants';
import type { GameContext } from '@/core/types';
import { GameLoop } from '@/game/GameLoop';
import { HexGrid } from '@/grid/HexGrid';
import { AssetLoader } from '@/render/AssetLoader';
import { RenderPipeline } from '@/render/RenderPipeline';
import { createInitialState } from '@/state/createInitialState';
import { ActionScheduler } from '@/systems/ActionScheduler';
import { fixCanvasSize, InputSystem } from '@/systems/InputSystem';

export class Game {
  private readonly assets = new AssetLoader();
  private readonly scheduler = new ActionScheduler();
  private readonly hexGrid: HexGrid;
  private readonly state;
  private readonly ctx: GameContext;
  private readonly renderer: RenderPipeline;
  private readonly input: InputSystem;
  private readonly loop: GameLoop;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly barCanvas: HTMLCanvasElement,
  ) {
    this.hexGrid = new HexGrid(canvas, HEX_RADIUS);
    this.state = createInitialState(this.hexGrid);
    this.ctx = {
      state: this.state,
      hexGrid: this.hexGrid,
      scheduler: this.scheduler,
      barCanvas: this.barCanvas,
    };

    this.renderer = new RenderPipeline(canvas, barCanvas, this.hexGrid, this.assets);
    this.input = new InputSystem(this.ctx, canvas);
    this.loop = new GameLoop(() => this.renderer.render(this.state));
  }

  async start(): Promise<void> {
    fixCanvasSize(this.canvas, this.barCanvas);
    this.input.updateViewport();
    await this.assets.loadAll();
    this.input.bind();
    this.loop.start();
  }

  destroy(): void {
    this.loop.stop();
    this.input.unbind();
    this.scheduler.stop();
  }
}
