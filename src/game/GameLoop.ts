import { TIMING } from '@/core/constants';

export class GameLoop {
  private frameHandle: number | null = null;
  private lastTick = 0;
  private running = false;

  constructor(private readonly onFrame: () => void) {}

  start(): void {
    if (this.running) return;
    this.running = true;
    this.lastTick = performance.now();
    this.schedule();
  }

  stop(): void {
    this.running = false;
    if (this.frameHandle !== null) {
      cancelAnimationFrame(this.frameHandle);
      this.frameHandle = null;
    }
  }

  private schedule(): void {
    this.frameHandle = requestAnimationFrame((now) => {
      if (!this.running) return;

      if (now - this.lastTick >= TIMING.renderIntervalMs) {
        this.lastTick = now;
        this.onFrame();
      }

      this.schedule();
    });
  }
}
