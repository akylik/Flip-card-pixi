import * as PIXI from "pixi.js";
import { sound } from "@pixi/sound";
import { Game } from "./Game";
import { CONFIG } from "./config";

let app: PIXI.Application | null = null;
let game: Game | undefined;

async function init(): Promise<void> {
  if ((window as any).__PIXI_GAME_INITIALIZED__) return;
  (window as any).__PIXI_GAME_INITIALIZED__ = true;

  app = new PIXI.Application({
    width: CONFIG.GAME_WIDTH,
    height: CONFIG.GAME_HEIGHT,
    backgroundColor: CONFIG.GAME_BG_COLOR,
    resizeTo: window,
  });

  document.body.appendChild(app.view as HTMLCanvasElement);
  window.addEventListener("resize", resize);
  resize();

  sound.volumeAll = 0.5;

  try {
    const assets = await loadAssets();
    setup(assets);
  } catch (err) {
    console.error("Assets loading failed:", err);
  }
}

async function loadAssets(): Promise<{
  backside: PIXI.Texture;
  kingOfCoins: PIXI.Texture;
  cardFlipSound: string;
}> {
  PIXI.Assets.add("backside", "./assets/backside.png");
  PIXI.Assets.add("kingOfCoins", "./assets/kingOfCoins.png");
  PIXI.Assets.add("cardFlip", "/sound/mb_card_deal_08.mp3");

  const assets = await PIXI.Assets.load([
    "backside",
    "kingOfCoins",
    "cardFlip",
  ]);

  return {
    backside: assets.backside!,
    kingOfCoins: assets.kingOfCoins!,
    cardFlipSound: assets.cardFlip!,
  };
}

function setup(assets: {
  backside: PIXI.Texture;
  kingOfCoins: PIXI.Texture;
  cardFlipSound: string;
}): void {
  game = new Game(app!, assets);

  app!.ticker.add((delta: number) => {
    game?.update(delta);
  });
}

function resize(): void {
  game?.resize();

  if (!app) return;

  const width: number = window.innerWidth;
  const height: number = window.innerHeight;

  const canvas = app.view as HTMLCanvasElement;
  canvas.style.position = "absolute";

  canvas.style.left = `${(width - CONFIG.GAME_WIDTH) / 2}px`;
  canvas.style.top = `${(height - CONFIG.GAME_HEIGHT) / 2}px`;
}

// if (import.meta.webpackHot) {
//   import.meta.webpackHot.accept();
//   import.meta.webpackHot.dispose(() => {
//     console.log("HMR: Disposing old app...");
//     if (app) {
//       app.destroy(true, true);
//       app = null;
//     }
//   });
// }

init();
