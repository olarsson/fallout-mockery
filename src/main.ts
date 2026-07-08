import { Game } from '@/game/Game';
import {
  AnimationTester,
  enableAnimationTesterLayout,
  hideGameUi,
  isAnimationTesterMode,
} from '@/dev/AnimationTester';
import '@/styles/main.css';

function getCanvas(id: string): HTMLCanvasElement {
  const element = document.getElementById(id);
  if (!(element instanceof HTMLCanvasElement)) {
    throw new Error(`Expected <canvas id="${id}">`);
  }
  return element;
}

function getElement<T extends HTMLElement>(id: string, type: new () => T): T {
  const element = document.getElementById(id);
  if (!(element instanceof type)) {
    throw new Error(`Expected <${type.name.toLowerCase()} id="${id}">`);
  }
  return element;
}

async function main(): Promise<void> {
  if (isAnimationTesterMode()) {
    enableAnimationTesterLayout();
    hideGameUi();
    const testerRoot = document.getElementById('anim-tester-root');
    if (!testerRoot) {
      throw new Error('Expected <div id="anim-tester-root">');
    }
    const tester = new AnimationTester(testerRoot);
    await tester.start();
    window.addEventListener('beforeunload', () => tester.destroy());
    return;
  }

  const canvas = getCanvas('canvas');
  const barCanvas = getCanvas('canvasBar');
  const playerHp = getElement('player-hp', HTMLElement);
  const endTurnBtn = getElement('end-turn-btn', HTMLButtonElement);
  const gameOverOverlay = getElement('game-over', HTMLElement);
  const tryAgainBtn = getElement('try-again-btn', HTMLButtonElement);
  const game = new Game(canvas, barCanvas, {
    playerHp,
    endTurnBtn,
    gameOverOverlay,
    tryAgainBtn,
  });

  await game.start();

  window.addEventListener('beforeunload', () => {
    game.destroy();
  });
}

main().catch((error: unknown) => {
  console.error('Failed to start game', error);
});
