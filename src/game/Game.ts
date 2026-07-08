import { CANVAS_HEIGHT, CANVAS_WIDTH, GRID_COLS, GRID_ROWS } from '@/core/constants';
import type { GameContext } from '@/core/types';
import { GameLoop } from '@/game/GameLoop';
import { HexGrid } from '@/grid/HexGrid';
import { AssetLoader } from '@/render/AssetLoader';
import { RenderPipeline } from '@/render/RenderPipeline';
import { createInitialState, resetGameState } from '@/state/createInitialState';
import { ActionScheduler } from '@/systems/ActionScheduler';
import { CombatSystem } from '@/systems/CombatSystem';
import { fixCanvasSize, InputSystem } from '@/systems/InputSystem';

export type GameUiElements = {
  playerHp: HTMLElement;
  endTurnBtn: HTMLButtonElement;
  gameOverOverlay: HTMLElement;
  tryAgainBtn: HTMLButtonElement;
};

export class Game {
  private readonly assets = new AssetLoader();
  private readonly scheduler = new ActionScheduler();
  private readonly hexGrid: HexGrid;
  private readonly state;
  private readonly ctx: GameContext;
  private readonly renderer: RenderPipeline;
  private readonly input: InputSystem;
  private readonly combat: CombatSystem;
  private readonly loop: GameLoop;
  private readonly onTryAgain = (): void => {
    this.restart();
  };

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly barCanvas: HTMLCanvasElement,
    private readonly ui: GameUiElements,
  ) {
    this.hexGrid = new HexGrid(GRID_COLS, GRID_ROWS, CANVAS_WIDTH, CANVAS_HEIGHT);
    this.state = createInitialState(this.hexGrid);
    this.ctx = {
      state: this.state,
      hexGrid: this.hexGrid,
      scheduler: this.scheduler,
      barCanvas: this.barCanvas,
    };

    this.renderer = new RenderPipeline(canvas, barCanvas, this.hexGrid, this.assets);
    this.combat = new CombatSystem(this.ctx);
    this.input = new InputSystem(this.ctx, canvas, this.combat, this.ui.endTurnBtn);
    this.loop = new GameLoop(() => {
      this.renderer.render(this.state);
      this.updateUi();
    });
  }

  async start(): Promise<void> {
    fixCanvasSize(this.canvas, this.barCanvas);
    this.input.updateViewport();
    await this.assets.loadAll();
    this.input.bind();
    this.ui.tryAgainBtn.addEventListener('click', this.onTryAgain);
    this.ui.gameOverOverlay.setAttribute('aria-hidden', 'true');
    this.updateUi();
    this.loop.start();
  }

  destroy(): void {
    this.loop.stop();
    this.input.unbind();
    this.ui.tryAgainBtn.removeEventListener('click', this.onTryAgain);
    this.scheduler.stop();
  }

  restart(): void {
    this.scheduler.stop();
    resetGameState(this.state, this.hexGrid);
    this.input.updateViewport();
    this.updateUi();
  }

  private updateUi(): void {
    const { player, combat, gameOver } = this.state;
    this.ui.playerHp.textContent = `HP: ${player.health} / ${player.DEFAULTS.maxHealth}`;
    this.ui.playerHp.classList.toggle('is-dead', gameOver);

    this.ui.gameOverOverlay.classList.toggle('is-visible', gameOver);
    this.ui.gameOverOverlay.setAttribute('aria-hidden', gameOver ? 'false' : 'true');

    const current = combat.queue[combat.queuePos];
    const isPlayerTurn =
      !gameOver &&
      combat.inCombat &&
      !!current &&
      'id' in current &&
      current.id === '_player';

    this.ui.endTurnBtn.hidden = !isPlayerTurn;
    this.ui.endTurnBtn.disabled = !isPlayerTurn || player.stopActions;
  }
}
