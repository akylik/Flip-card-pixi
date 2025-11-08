import * as PIXI from "pixi.js";
import { sound } from "@pixi/sound";

import { CardView } from "../view/CardView";
import { CONFIG } from "../config";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class CardDeck {
  private container: PIXI.Container;
  private cardViews: CardView[] = [];

  constructor(
    x: number,
    y: number,
    backTexture: PIXI.Texture,
    faceTextures: PIXI.Texture[],
  ) {
    this.container = new PIXI.Container();
    this.container.x = x;
    this.container.y = y;

    this.createDeck(backTexture, faceTextures);
  }

  public getContainer(): PIXI.Container {
    return this.container;
  }

  public setPosition(x: number, y: number): void {
    this.container.x = x;
    this.container.y = y;
  }

  public async revealNext(): Promise<void> {
    if (this.cardViews.length === 0) return;

    const card = this.cardViews.shift()!;
    sound.play("cardFlip", { volume: 0.7 });

    await card.flip();
    await delay(1000);
    await card.fadeOut();
    card.destroyCard();
  }

  private createDeck(backTexture: PIXI.Texture, faceTextures: PIXI.Texture[]): void {
    const offset = CONFIG.CARD_OFFSET;

    for (let i = 0; i < CONFIG.CREATED_CARD; i++) {
      const faceTexture = faceTextures[i % faceTextures.length];
      const card = new CardView(backTexture, faceTexture);

      card.x = i * offset;
      card.y = -i * offset;
      card.zIndex = 100 - i;

      this.cardViews.push(card);
      this.container.addChild(card);
    }

    this.container.sortChildren();
  }
}
