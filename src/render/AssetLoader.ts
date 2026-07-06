import { SPRITE_URLS } from '@/config/sprites';

export class AssetLoader {
  private readonly images = new Map<string, HTMLImageElement>();
  private loaded = false;

  async loadAll(): Promise<void> {
    const entries = Object.entries(SPRITE_URLS);
    await Promise.all(
      entries.map(([key, url]) => this.loadImage(key, url)),
    );
    this.loaded = true;
  }

  get(key: string): HTMLImageElement {
    const image = this.images.get(key);
    if (!image) {
      throw new Error(`Missing image asset: ${key}`);
    }
    return image;
  }

  isLoaded(): boolean {
    return this.loaded;
  }

  private loadImage(key: string, url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => {
        this.images.set(key, image);
        resolve();
      };
      image.onerror = () => reject(new Error(`Failed to load ${url}`));
      image.src = url;
    });
  }
}
