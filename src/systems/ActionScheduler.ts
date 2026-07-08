import { TIMING } from '@/core/constants';

type IntervalHandle = ReturnType<typeof setInterval>;

export class ActionScheduler {
  private nextId = 0;
  private generation = 0;
  private handles = new Map<number, IntervalHandle>();
  private timeoutHandles = new Set<ReturnType<typeof setTimeout>>();

  stop(): void {
    this.generation += 1;

    for (const handle of this.handles.values()) {
      clearInterval(handle);
    }
    this.handles.clear();

    for (const handle of this.timeoutHandles) {
      clearTimeout(handle);
    }
    this.timeoutHandles.clear();
  }

  scheduleRepeating(
    intervalMs: number,
    ticks: number,
    onTick: (tick: number) => void,
    onComplete?: () => void,
  ): number {
    const runGeneration = this.generation;
    let currentTick = 0;
    const id = (this.nextId += 1);

    const handle = setInterval(() => {
      if (runGeneration !== this.generation) {
        clearInterval(handle);
        this.handles.delete(id);
        return;
      }

      currentTick += 1;
      onTick(currentTick);

      if (currentTick >= ticks) {
        clearInterval(handle);
        this.handles.delete(id);
        if (runGeneration === this.generation) {
          onComplete?.();
        }
      }
    }, intervalMs);

    this.handles.set(id, handle);
    return id;
  }

  delay(ms: number, callback: () => void): void {
    const runGeneration = this.generation;
    const handle = setTimeout(() => {
      this.timeoutHandles.delete(handle);
      if (runGeneration !== this.generation) return;
      callback();
    }, ms);
    this.timeoutHandles.add(handle);
  }

  cancel(id: number): void {
    const handle = this.handles.get(id);
    if (handle) {
      clearInterval(handle);
      this.handles.delete(id);
    }
  }
}

export const DEFAULT_ATTACK_TICK_MS = TIMING.attackTickMs;
