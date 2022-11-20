import * as ex from "excalibur";
import { getSideBackground, getSpritesToDisplay, Views } from "../utils/map";
import { Global } from "../class/global";
import { Player } from "../class/player";
import _dico from "../../resources/script/dictionnaire.json";
import type { Sprites } from "../../models";
import { blocksSpriteSheet, Glitches, Images, mapArray } from "../resources";
import { ParallaxComponent } from "excalibur";
import { Pumpkin } from "../class/pumpkin";
import { collapseTextChangeRangesAcrossMultipleVersions } from "typescript";

const dico = _dico as Sprites;

export class SideScene extends ex.Scene {
  private player: Player;
  private pumpkin: Pumpkin;
  public mapWidth = 500;

  constructor(halfDrawWidth: number, halfDrawHeigh: number) {
    super();
    this.player = new Player(10, 10);

    this.pumpkin = new Pumpkin(
      Global.globalConfig.pumpkin_pos.x * Global.globalConfig.sprite_size,
      Global.globalConfig.pumpkin_pos.y * Global.globalConfig.sprite_size + 10
    );
    this.add(this.pumpkin);
    this.add(this.player);
    this.player.on("move", () => this.playerDeath());
  }

  public onInitialize(engine: ex.Engine): void {
    engine.input.keyboard.on("hold", (evt) => this.nextLevel());
  }

  public onActivate(_context: ex.SceneActivationContext<unknown>): void {
    // Set physics
    ex.Physics.useArcadePhysics();
    ex.Physics.acc = ex.vec(0, Global.globalConfig.gravity);
    this.player.vel.setTo(0, 0);

    // Load map
    this.loadMap();

    // Load player
    const player_pos = Global.globalConfig.player_pos;
    player_pos.x *= Global.globalConfig.sprite_size;
    player_pos.y = (14 - player_pos.y) * Global.globalConfig.sprite_size;
    if (!this.player.isKilled()) {
      this.player.kill();
    }
    this.player = new Player(player_pos.x, player_pos.y);
    this.add(this.player);
  }

  public onDeactivate(_context: ex.SceneActivationContext<undefined>): void {
    const sprite_size = Global.globalConfig.sprite_size;
    Global.globalConfig.player_pos.x = Math.round(
      (this.player.pos.x + 10) / sprite_size
    );
    Global.globalConfig.player_pos.y =
      14 - Math.floor(this.player.pos.y / sprite_size);
    this.clear();
  }

  private loadBackground() {
    const background = getSideBackground(
      mapArray[Global.globalConfig.currentLevel]
    );
    const sprite_size = Global.globalConfig.sprite_size;

    for (const block of background) {
      const ref = dico[block.id];

      const actorPayload: any = {
        pos: ex.vec(block.x * sprite_size, block.y * sprite_size),
        width: sprite_size,
        height: sprite_size,
        collisionType: ex.CollisionType.PreventCollision,
      };
      const actor = new ex.Actor(actorPayload);

      const sprite = blocksSpriteSheet.sprites[ref.y * 32 + ref.x].clone();
      sprite.height = sprite_size;
      sprite.width = sprite_size;
      sprite.opacity = 0.1;

      const darkOverlay = sprite.clone();
      darkOverlay.tint = new ex.Color(0, 0, 0, 0.5);

      actor.graphics.use(sprite);
      actor.graphics.add(darkOverlay);

      this.add(actor);
    }
  }

  private loadSky() {
    for (let i = -1; i < 3; i++) {
      const width = (window.innerHeight * 16) / 9;

      const skySide = new ex.Actor({
        pos: ex.vec(i * width, 0),
        width: window.innerWidth,
        height: window.innerHeight,
      });

      const skySideSprite = Images.skySide.toSprite();
      skySideSprite.width = width;
      skySideSprite.height = window.innerHeight;

      skySide.addComponent(new ParallaxComponent(ex.vec(0.05, 0)));
      skySide.graphics.add("sky", skySideSprite);
      skySide.graphics.use("sky");

      this.add(skySide);
    }
  }

  private loadMap() {
    // Get sprites to display
    const glitches = [
      ex.Animation.fromSpriteSheet(Glitches["10"], ex.range(0, 3), 70),
      ex.Animation.fromSpriteSheet(Glitches["50"], ex.range(0, 3), 70),
      ex.Animation.fromSpriteSheet(Glitches["100"], ex.range(0, 3), 70),
    ];
    console.log(Global.globalConfig.currentLevel);
    const sprites = getSpritesToDisplay(
      mapArray[Global.globalConfig.currentLevel],
      Views.Side
    );
    const sprite_size = Global.globalConfig.sprite_size;
    this.loadSky();
    this.loadBackground();

    // Load pumpkin
    if (!Global.globalConfig.hasPumpkin) {
      this.pumpkin = new Pumpkin(
        Global.globalConfig.pumpkin_pos.x * sprite_size,
        Global.globalConfig.pumpkin_pos.y * sprite_size + 10
      );
      this.add(this.pumpkin);
    }

    // Get sprites to display

    for (const block of sprites.playerLayer) {
      const ref = dico[block.id]; // Get block reference by ID
      const isGlitched = Math.random() * 5 < Global.globalConfig.glitchness;
      const glichSeed = Math.random() * 5;
      const glitchLevel =
        glichSeed < Global.globalConfig.glitchness
          ? 2
          : glichSeed < Global.globalConfig.glitchness * 2
          ? 1
          : 0;
      const actorPayload: any = {
        pos: ex.vec(block.x * sprite_size, block.y * sprite_size),
        width: sprite_size,
        height: sprite_size,
      };
      if (ref.collision) {
        actorPayload.collisionType = ex.CollisionType.Fixed;
      }
      // Create new block actor
      const actor = new ex.Actor(actorPayload);
      // Get sprite from spritesheet
      const sprite = blocksSpriteSheet.sprites[ref.y * 32 + ref.x];
      sprite.height = Global.globalConfig.sprite_size; // Set size for responsive
      sprite.width = Global.globalConfig.sprite_size; // Set size for responsive

      actor.graphics.use(sprite); // Add sprite on the block actor
      if (isGlitched) {
        const glitch = glitches[glitchLevel].clone();
        actor.graphics.add(glitch);
      }

      // kill player on aggressive sprite
      if (ref.agressive) {
        actor.on("precollision", (evt) => {
          if (evt.other === this.player) {
            this.player.kill();
          }
        });
      }

      this.add(actor); // Add the actor to the scene
    }
  }

  public nextLevel() {
    console.log(this.player.pos.x);
    console.log(mapArray[Global.globalConfig.currentLevel][1].width);
    if (
      this.player.pos.x >=
      (mapArray[Global.globalConfig.currentLevel][1].width - 10) * 10
    ) {
      Global.globalConfig.currentLevel++;
    }
    if (Global.globalConfig.currentLevel >= mapArray.length) {
      Global.globalConfig.currentLevel = 0;
    }
  }

  public playerDeath() {
    console.log("player death");
    this.player.pos.x = 200;
  }
}
