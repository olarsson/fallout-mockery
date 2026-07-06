import { Game } from '@/game/Game';
import '@/styles/main.css';

function getCanvas(id: string): HTMLCanvasElement {
  const element = document.getElementById(id);
  if (!(element instanceof HTMLCanvasElement)) {
    throw new Error(`Expected <canvas id="${id}">`);
  }
  return element;
}

async function main(): Promise<void> {
  const canvas = getCanvas('canvas');
  const barCanvas = getCanvas('canvasBar');
  const game = new Game(canvas, barCanvas);

  await game.start();

  window.addEventListener('beforeunload', () => {
    game.destroy();
  });
}

main().catch((error: unknown) => {
  console.error('Failed to start game', error);
});
