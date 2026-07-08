import { PLAYER_CHARACTER_ANIMATIONS } from '@/config/playerCharacterAtlas';
import { CORD_PRIORITIES, TIMING } from '@/core/constants';
import type { PlayerCharacterAnimation, SpriteSheetConfig } from '@/core/types';
import { AssetLoader } from '@/render/AssetLoader';
import { drawSprite } from '@/render/SpriteRenderer';

type SourceMode = 'atlas' | 'standalone';

export class AnimationTester {
  private readonly assets = new AssetLoader();
  private readonly canvas: HTMLCanvasElement;
  private readonly atlasCanvas: HTMLCanvasElement;
  private readonly select: HTMLSelectElement;
  private readonly facingLabel: HTMLElement;
  private readonly frameSlider: HTMLInputElement;
  private readonly frameLabel: HTMLElement;
  private readonly playBtn: HTMLButtonElement;
  private readonly sourceSelect: HTMLSelectElement;
  private readonly facingButtons: HTMLButtonElement[] = [];

  private animationIndex = 0;
  private facingRow = 0;
  private frame = 0;
  private playing = false;
  private lastTick = 0;
  private rafId = 0;

  constructor(private readonly root: HTMLElement) {
    this.root.innerHTML = `
      <div id="anim-tester-panel">
        <header id="anim-tester-header">
          <h1>Player Animation Tester</h1>
          <p>Preview sprites from <code>character.gif</code>. Add <code>?animtest</code> to the URL.</p>
          <a id="anim-tester-back" href="/">Back to game</a>
        </header>
        <p id="anim-tester-status" class="anim-tester-status">Loading sprites…</p>
        <div id="anim-tester-body" hidden>
          <aside id="anim-tester-controls">
            <label class="anim-field">
              Animation
              <select id="anim-select"></select>
            </label>
            <label class="anim-field">
              Source
              <select id="anim-source">
                <option value="atlas">Atlas (character.gif)</option>
                <option value="standalone">Standalone crop</option>
              </select>
            </label>
            <div class="anim-field">
              <span>Facing</span>
              <div id="anim-facing" class="anim-facing"></div>
            </div>
            <label class="anim-field">
              Frame <span id="anim-frame-label">0</span>
              <input id="anim-frame" type="range" min="0" max="0" value="0" />
            </label>
            <button type="button" id="anim-play">Play</button>
          </aside>
          <div id="anim-tester-preview">
            <canvas id="anim-canvas" width="280" height="280"></canvas>
            <p id="anim-meta"></p>
          </div>
          <div id="anim-tester-atlas">
            <p class="anim-atlas-title">Atlas region</p>
            <canvas id="anim-atlas-canvas" width="360" height="360"></canvas>
          </div>
        </div>
      </div>
    `;

    this.canvas = this.getCanvas('anim-canvas');
    this.atlasCanvas = this.getCanvas('anim-atlas-canvas');
    this.select = this.getElement('anim-select', HTMLSelectElement);
    this.facingLabel = this.getElement('anim-facing', HTMLElement);
    this.frameSlider = this.getElement('anim-frame', HTMLInputElement);
    this.frameLabel = this.getElement('anim-frame-label', HTMLElement);
    this.playBtn = this.getElement('anim-play', HTMLButtonElement);
    this.sourceSelect = this.getElement('anim-source', HTMLSelectElement);

    for (const key of CORD_PRIORITIES) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = key;
      btn.addEventListener('click', () => {
        const index = CORD_PRIORITIES.indexOf(key);
        this.setFacing(index === -1 ? 0 : index);
      });
      this.facingButtons.push(btn);
      this.facingLabel.append(btn);
    }

    for (const [index, animation] of PLAYER_CHARACTER_ANIMATIONS.entries()) {
      const option = document.createElement('option');
      option.value = String(index);
      option.textContent = animation.label;
      this.select.append(option);
    }
  }

  async start(): Promise<void> {
    const status = this.getElement('anim-tester-status', HTMLElement);
    const body = this.getElement('anim-tester-body', HTMLElement);

    try {
      await this.assets.loadAll();
      status.hidden = true;
      body.hidden = false;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      status.textContent = `Failed to load sprites: ${message}`;
      status.classList.add('is-error');
      return;
    }

    this.select.addEventListener('change', () => {
      this.animationIndex = Number(this.select.value);
      this.frame = 0;
      this.playing = false;
      this.playBtn.textContent = 'Play';
      this.syncSourceMode();
      this.syncControls();
      this.draw();
    });
    this.sourceSelect.addEventListener('change', () => {
      this.syncControls();
      this.draw();
    });
    this.frameSlider.addEventListener('input', () => {
      this.frame = Number(this.frameSlider.value);
      this.frameLabel.textContent = String(this.frame);
      this.draw();
    });
    this.playBtn.addEventListener('click', () => {
      this.playing = !this.playing;
      this.playBtn.textContent = this.playing ? 'Pause' : 'Play';
      if (this.playing) {
        this.lastTick = performance.now();
        this.tick();
      } else {
        cancelAnimationFrame(this.rafId);
      }
    });

    this.syncSourceMode();
    this.syncControls();
    this.draw();
  }

  destroy(): void {
    cancelAnimationFrame(this.rafId);
  }

  private tick = (): void => {
    const now = performance.now();
    if (now - this.lastTick >= TIMING.moveFrameMs) {
      this.lastTick = now;
      const animation = PLAYER_CHARACTER_ANIMATIONS[this.animationIndex];
      if (!animation) return;
      const config = this.activeConfig(animation);
      const maxFrame = (config.totalFrames ?? config.countX) - 1;
      this.frame = this.frame >= maxFrame ? 0 : this.frame + 1;
      this.frameSlider.value = String(this.frame);
      this.frameLabel.textContent = String(this.frame);
      this.draw();
    }
    this.rafId = requestAnimationFrame(this.tick);
  };

  private syncSourceMode(): void {
    const animation = PLAYER_CHARACTER_ANIMATIONS[this.animationIndex];
    const hasStandalone = Boolean(animation?.standaloneKey);
    this.sourceSelect.disabled = !hasStandalone;
    if (!hasStandalone) {
      this.sourceSelect.value = 'atlas';
    }
  }

  private syncControls(): void {
    const animation = PLAYER_CHARACTER_ANIMATIONS[this.animationIndex];
    if (!animation) return;

    const config = this.activeConfig(animation);
    const maxFrame = Math.max(0, (config.totalFrames ?? config.countX) - 1);
    this.frame = Math.min(this.frame, maxFrame);
    this.frameSlider.max = String(maxFrame);
    this.frameSlider.value = String(this.frame);
    this.frameLabel.textContent = String(this.frame);

    const maxFacing = Math.max(0, config.countY - 1);
    this.facingRow = Math.min(this.facingRow, maxFacing);
    for (const [index, btn] of this.facingButtons.entries()) {
      btn.hidden = index > maxFacing;
      btn.classList.toggle('is-active', index === this.facingRow);
    }

    const meta = this.getElement('anim-meta', HTMLElement);
    const source = this.sourceMode();
    const sx = config.sourceX ?? 0;
    const sy = config.sourceY ?? 0;
    meta.textContent =
      `${animation.id} · ${source} · frame ${this.frame}/${maxFrame} · facing row ${this.facingRow}` +
      (source === 'atlas' ? ` · atlas @ (${sx}, ${sy})` : '');
  }

  private setFacing(row: number): void {
    this.facingRow = row;
    for (const [index, btn] of this.facingButtons.entries()) {
      btn.classList.toggle('is-active', index === row);
    }
    this.draw();
  }

  private sourceMode(): SourceMode {
    return this.sourceSelect.value === 'standalone' ? 'standalone' : 'atlas';
  }

  private activeConfig(animation: PlayerCharacterAnimation): SpriteSheetConfig {
    if (this.sourceMode() === 'standalone' && animation.standaloneKey) {
      return { ...animation.config, imageKey: animation.standaloneKey };
    }
    return animation.config;
  }

  private draw(): void {
    const animation = PLAYER_CHARACTER_ANIMATIONS[this.animationIndex];
    if (!animation) return;

    const config = this.activeConfig(animation);
    const ctx = this.canvas.getContext('2d');
    const atlasCtx = this.atlasCanvas.getContext('2d');
    if (!ctx || !atlasCtx) return;

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.fillStyle = '#2a2418';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    const destX = this.canvas.width / 2;
    const destY = this.canvas.height * 0.72;
    drawSprite(ctx, this.assets, config, destX, destY, this.frame, this.facingRow);

    this.drawAtlasPreview(atlasCtx, config);
    this.syncControls();
  }

  private drawAtlasPreview(ctx: CanvasRenderingContext2D, config: SpriteSheetConfig): void {
    ctx.clearRect(0, 0, this.atlasCanvas.width, this.atlasCanvas.height);
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, this.atlasCanvas.width, this.atlasCanvas.height);

    if (this.sourceMode() === 'standalone') {
      ctx.fillStyle = '#888';
      ctx.font = '14px monospace';
      ctx.fillText('Standalone crop — no atlas preview', 16, 32);
      return;
    }

    const atlas = this.assets.get('playerCharacter');
    const sourceX = (config.sourceX ?? 0) + config.clipX * this.frame;
    const sourceY = (config.sourceY ?? 0) + config.clipY * this.facingRow;
    const pad = 24;
    const scale = Math.min(
      (this.atlasCanvas.width - pad * 2) / config.width,
      (this.atlasCanvas.height - pad * 2) / config.height,
      4,
    );
    const destW = config.width * scale;
    const destH = config.height * scale;
    const destX = (this.atlasCanvas.width - destW) / 2;
    const destY = (this.atlasCanvas.height - destH) / 2;

    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(
      atlas,
      sourceX,
      sourceY,
      config.width,
      config.height,
      destX,
      destY,
      destW,
      destH,
    );
    ctx.strokeStyle = '#ff44aa';
    ctx.lineWidth = 2;
    ctx.strokeRect(destX, destY, destW, destH);
  }

  private getCanvas(id: string): HTMLCanvasElement {
    return this.getElement(id, HTMLCanvasElement);
  }

  private getElement<T extends HTMLElement>(id: string, type: new () => T): T {
    const element = this.root.querySelector(`#${id}`);
    if (!(element instanceof type)) {
      throw new Error(`AnimationTester: expected #${id}`);
    }
    return element;
  }
}

export function isAnimationTesterMode(): boolean {
  const params = new URLSearchParams(window.location.search);
  if (params.has('animtest')) return true;
  return window.location.hash === '#animtest';
}

export function enableAnimationTesterLayout(): void {
  document.body.classList.add('anim-test-mode');
}

export function hideGameUi(): void {
  enableAnimationTesterLayout();
  const gameRoot = document.getElementById('game-root');
  if (gameRoot) gameRoot.hidden = true;
}
