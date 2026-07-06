import { TIMING } from '@/core/constants';

type IntervalHandle = ReturnType<typeof setInterval>;

export class ActionScheduler {
  private nextId = 0;
  private handles = new Map<number, IntervalHandle>();

  stop(): void {
    for (const handle of this.handles.values()) {
      clearInterval(handle);
    }
    this.handles.clear();
  }

  scheduleRepeating(
    intervalMs: number,
    ticks: number,
    onTick: (tick: number) => void,
    onComplete?: () => void,
  ): number {
    let currentTick = 0;
    const id = (this.nextId += 1);

    const handle = setInterval(() => {
      currentTick += 1;
      onTick(currentTick);

      if (currentTick >= ticks) {
        clearInterval(handle);
        this.handles.delete(id);
        onComplete?.();
      }
    }, intervalMs);

    this.handles.set(id, handle);
    return id;
  }

  delay(ms: number, callback: () => void): void {
    setTimeout(callback, ms);
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
