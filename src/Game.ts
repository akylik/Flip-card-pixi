import * as PIXI from "pixi.js";
import { CONFIG } from "./config";
import { CardDeck } from "./component/CardDeck";
import { Button } from "./ui/button";

export class Game {
  private app: PIXI.Application;
  private deck: CardDeck | null = null;
  private button: Button | null = null;

  constructor(
    app: PIXI.Application,
    assets: {
      backside: PIXI.Texture;
      kingOfCoins: PIXI.Texture;
      cardFlipSound: string;
    }
  ) {
    this.app = app;
    this.init(assets);
  }

  public update(delta: number): void {}
  public resize(): void {}

  private init(assets: {
    backside: PIXI.Texture;
    kingOfCoins: PIXI.Texture;
    cardFlipSound: string;
  }): void {
    const { backside, kingOfCoins, cardFlipSound } = assets;

    const field = new PIXI.Graphics();
    field.beginFill(0x00ff00);
    field.drawRect(0, 0, CONFIG.GAME_WIDTH, CONFIG.GAME_HEIGHT);
    field.endFill();
    this.app.stage.addChild(field);

    this.deck = new CardDeck(
      CONFIG.GAME_WIDTH / 2,
      CONFIG.GAME_HEIGHT / 2,
      backside,
      [kingOfCoins]
    );

    this.app.stage.addChild(this.deck.getContainer());

    this.button = new Button(
      CONFIG.GAME_WIDTH / 2,
      CONFIG.GAME_HEIGHT - 100,
      () => this.handleReveal()
    );

    this.app.stage.addChild(this.button);
  }

  private async handleReveal(): Promise<void> {
    if (!this.button || !this.deck) return;

    this.button.disabled = true;

    try {
      await this.deck.revealNext();
    } finally {
      this.button.disabled = false;
    }
  }
}
