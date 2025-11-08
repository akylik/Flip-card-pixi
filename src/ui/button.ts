import * as PIXI from "pixi.js";
import { gsap } from "gsap";


const style = new PIXI.TextStyle({
  fontFamily: 'Arial',
  fontSize: 26,
  fontStyle: 'italic',
  fontWeight: 'bold',
  fill: ['#ffffff', '#00ff99'],
  stroke: '#4a1850',
  strokeThickness: 5,
  dropShadow: true,
  dropShadowColor: '#000000',
  dropShadowBlur: 4,
  dropShadowAngle: Math.PI / 6,
  dropShadowDistance: 6,
  wordWrap: true,
  wordWrapWidth: 440,
  lineJoin: 'round',
});

export class Button extends PIXI.Container {
  private callback: () => void;
  private bg: PIXI.Graphics | null = null;
  private text: PIXI.Text | null = null;
  private _disabled = false;

  constructor(x: number, y: number, onClick: () => void) {
    super();

    this.callback = onClick;

    this.x = x;
    this.y = y;

    this.createButton();
  }

  private createButton(): void {
    const bg = this.bg = new PIXI.Graphics();
    bg.lineStyle(2, 0xfeeb77, 1);
    bg.beginFill(0x28a745);
    bg.drawRoundedRect(-80, 0, 160, 50, 25);
    bg.endFill();

    const text = this.text = new PIXI.Text("Reveal", style);
    text.anchor.set(0.5)
    text.y = 25;

    this.addChild(bg, text);

    this.interactive = true;
    this.cursor = "pointer";

    this.on("pointerdown", () => {
      if (!this._disabled) {
        this.callback();
      }
    });

    this.on("pointerover", () => {
      if (!this._disabled) {
        gsap.to(this.scale, { x: 1.05, y: 1.05, duration: 0.2 });
      }
    });

    this.on("pointerout", () => {
      if (!this._disabled) {
        gsap.to(this.scale, { x: 1, y: 1, duration: 0.2 });
      }
    });
  }

  public set disabled(value: boolean) {
    this._disabled = value;
    this.interactive = !value;
    this.cursor = value ? "default" : "pointer";

    gsap.to(this, {
      alpha: value ? 0.5 : 1,
      duration: 0.2,
    });
  }

  public get disabled(): boolean {
    return this._disabled;
  }
}
