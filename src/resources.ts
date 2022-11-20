import * as ex from "excalibur";
import { Global } from "./class/global";

const Images: { [key: string]: ex.ImageSource } = {
  player: new ex.ImageSource("./chuck.png"),
  playerJump: new ex.ImageSource("./chuckjump.png"),
  playerSideIdle: new ex.ImageSource("./chuckidle.png"),
  playerUpper: new ex.ImageSource("./upper.png"),
  blocks: new ex.ImageSource("./blocks.png"),
  pumpkin: new ex.ImageSource("./pumpkin.png"),
};

const PlayerJumpSpriteSheet = ex.SpriteSheet.fromImageSource({
  image: Images.playerJump,
  grid: {
    rows: 1,
    columns: 2,
    spriteHeight: Global.globalConfig.sprite_size,
    spriteWidth: Global.globalConfig.sprite_size,
  },
});

const SidePlayerSpriteSheet = ex.SpriteSheet.fromImageSource({
  image: Images.player,
  grid: {
    rows: 1,
    columns: 10,
    spriteHeight: Global.globalConfig.sprite_size,
    spriteWidth: Global.globalConfig.sprite_size,
  },
});

const SidePlayerIdle = ex.SpriteSheet.fromImageSource({
  image: Images.playerSideIdle,
  grid: {
    rows: 1,
    columns: 4,
    spriteHeight: Global.globalConfig.sprite_size,
    spriteWidth: Global.globalConfig.sprite_size,
  },
})

const blocksSpriteSheet = ex.SpriteSheet.fromImageSource({
  image: Images.blocks,
  grid: {
    rows: 32,
    columns: 32,
    spriteHeight: 16,
    spriteWidth: 16,
  },
});

const pumpkinAmin = ex.SpriteSheet.fromImageSource({
  image: Images.pumpkin,
  grid: {
    rows: 1,
    columns: 4,
    spriteWidth: Global.globalConfig.sprite_size,
    spriteHeight: Global.globalConfig.sprite_size,
  }
});

const UpperPlayerSpriteSheet = ex.SpriteSheet.fromImageSource({
  image: Images.playerUpper,
  grid: {
    rows: 4,
    columns: 4,
    spriteHeight: Global.globalConfig.sprite_size,
    spriteWidth: Global.globalConfig.sprite_size,
  },
});

const UpperPlayerSpriteSheetStopped = ex.SpriteSheet.fromImageSource({
  image: Images.playerUpper,
  grid: {
    rows: 4,
    columns: 1,
    spriteHeight: Global.globalConfig.sprite_size,
    spriteWidth: Global.globalConfig.sprite_size,
  },
});

const loader = new ex.Loader();
const allResources = { ...Images };
for (const res in allResources) {
  loader.addResource(allResources[res]);
}

export {
  Images,
  loader,
  PlayerJumpSpriteSheet,
  SidePlayerSpriteSheet,
  SidePlayerIdle,
  UpperPlayerSpriteSheet,
  blocksSpriteSheet,
  pumpkinAmin,
  UpperPlayerSpriteSheetStopped,
};
