import * as PIXI from 'pixi.js';
import { gsap } from "gsap";


export class CardView extends PIXI.Container {
  private sprite: PIXI.Sprite;
  private faceTexture: PIXI.Texture;

  constructor(backTexture: PIXI.Texture, faceTexture: PIXI.Texture) {
    super();

    this.faceTexture = faceTexture;
    this.sprite = new PIXI.Sprite(backTexture);
    this.sprite.anchor.set(0.5);
    this.addChild(this.sprite);

    this.scale.set(0.7);
  }

  public async flip(): Promise<void> {
    return new Promise((resolve) => {
      gsap.to(this.sprite.scale, {
        x: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          this.sprite.texture = this.faceTexture;
          gsap.to(this.sprite.scale, {
            x: 1,
            duration: 0.3,
            ease: "power2.out",
            onComplete: resolve,
          });
        },
      });
    });
  }

  public async fadeOut(): Promise<void> {
    return new Promise((resolve) => {
      gsap.to(this.sprite, {
        alpha: 0,
        duration: 0.6,
        ease: "power2.in",
        onComplete: resolve,
      });
    });
  }

  public destroyCard(): void {
    this.parent?.removeChild(this);
    this.destroy({ children: true });
  }
}