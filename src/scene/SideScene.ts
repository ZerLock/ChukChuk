import * as ex from "excalibur";
import { getSideBackground, getSpritesToDisplay, Views } from "../utils/map";
import { Global } from "../class/global";
import { Player } from "../class/player";
import _dico from "../../resources/script/dictionnaire.json";
import type { Sprites } from "../../models";
import { blocksSpriteSheet, Glitches, Images, mapArray, skySideGameGlitchSheet, Sounds } from "../resources";
import { ParallaxComponent } from "excalibur";
import { Pumpkin } from "../class/pumpkin";
import dialogs from "../../resources/dialogues.json";

const dico = _dico as Sprites;

export class SideScene extends ex.Scene {
  private player: Player;
  private pumpkin: Pumpkin | null = null;
  public mapWidth = 500;

  constructor(halfDrawWidth: number, halfDrawHeigh: number) {
    super();
    this.player = new Player(10, 10);

    if (Global.globalConfig.currentLevel == 0) {
      this.pumpkin = new Pumpkin(
        Global.globalConfig.pumpkin_pos.x * Global.globalConfig.sprite_size,
        Global.globalConfig.pumpkin_pos.y * Global.globalConfig.sprite_size + 10
      );
      this.add(this.pumpkin);
    }
    this.add(this.player);
  }


  private manageSounds() {
    Sounds.ambient.volume = 0.2;
    Sounds.glitch.volume = Global.globalConfig.glitchness / 10;
    if (!Sounds.ambient.isPlaying()) {
      Sounds.ambient.play();
    }
    if (!Sounds.glitch.isPlaying()) {
      Sounds.glitch.play();
    }
  }

  onPostUpdate(_engine: ex.Engine, _delta: number): void {
    this.manageSounds();
    this.playerDeath();
    this.nextLevel();
    this.cameraType();
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

  public onPreUpdate() {
    const spriteSize = Global.globalConfig.sprite_size;
    dialogs.map((dialog, index) => {
      if (
        this.player.pos.x >= dialog.trigger * spriteSize &&
        dialog.hasTriggered === false
      ) {
        if (dialog.level == Global.globalConfig.currentLevel) {
          dialogs[index].hasTriggered = true;
          const text = new ex.Text({
            text: `${dialog.name}:\n${dialog.text}`,
            color: ex.Color.Black,
          });
          const actor = new ex.Actor({
            pos: ex.vec(this.player.pos.x, this.player.pos.y - 40),
            scale: ex.vec(2, 2),
          });
          actor.graphics.use(text);
          const background = new ex.Actor({
            pos: ex.vec(actor.pos.x, actor.pos.y - 15),
            width: Math.ceil(text.width),
            height: Math.ceil(text.height),
            scale: ex.vec(2, 2),
            color: ex.Color.White,
          });
          this.add(background);
          this.add(actor);

          if (dialog.order === 0) {
            setTimeout(() => {
              this.pumpkin?.kill();
              Global.globalConfig.hasPumpkin = true;
              this.player.graphics.use("pumpkinRight");
            }, 2000);
          }
          setTimeout(() => {
            actor.kill();
            background.kill();
          }, 3000);
        }
      }
    });
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
    const glitchsidesky = ex.Animation.fromSpriteSheet(skySideGameGlitchSheet, ex.range(0, 8), 70);
    for (let i = -1; i < 3; i++) {
      const width = (window.innerHeight * 16) / 9;

      const skySide = new ex.Actor({
        pos: ex.vec(i * width, 0),
        width: window.innerWidth,
        height: window.innerHeight,
        collisionType: ex.CollisionType.PreventCollision,
      });

      const skySideSprite = Global.globalConfig.glitchness > 0.5 ? glitchsidesky : Images.skySideGame.toSprite();
      skySideSprite.scale = ex.vec(
        width / 1920 * (Global.globalConfig.glitchness > 0.5 ? 2 : 1),
        window.innerHeight / 1080 * (Global.globalConfig.glitchness > 0.5 ? 2 : 1)
      );

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
        console.log(ref)
        actor.on("precollision", () => {
          this.player.pos.x = 5 * Global.globalConfig.sprite_size;
          this.player.pos.y = 4 * Global.globalConfig.sprite_size;
        });
      }

      this.add(actor); // Add the actor to the scene
    }

    // invisible wall on x = 0
    const wall = new ex.Actor({
      pos: ex.vec(0, window.innerHeight),
      width: 5,
      height: 1000,
      collisionType: ex.CollisionType.Fixed,
    });
    this.add(wall);
  }

  public nextLevel() {
    if (
      this.player.pos.x >=
      (mapArray[Global.globalConfig.currentLevel][2].width - 10) * 64
    ) {
      Global.globalConfig.currentLevel++;
      if (Global.globalConfig.currentLevel >= mapArray.length) {
        this.engine.goToScene("ending");
        return;
      }
      this.player.pos.x = 5 * Global.globalConfig.sprite_size;
      this.player.pos.y = 4 * Global.globalConfig.sprite_size;
      Global.globalConfig.current_layer = 2;
      Global.globalConfig.glitchness /= 2;
      this.engine.goToScene("side");
    }
  }

  private cameraType() {
    if (this.player.pos.x >= window.innerWidth / 2) {
      this.camera.clearAllStrategies();
      this.camera.strategy.lockToActorAxis(this.player, ex.Axis.X);
    } else {
      this.camera.clearAllStrategies();
      this.camera.strategy.limitCameraBounds(
        new ex.BoundingBox(0, 0, window.innerWidth, window.innerHeight)
      );
    }
  }

  public playerDeath() {
    if (this.player.pos.y >= window.innerHeight) {
      this.player.pos.x = 7 * Global.globalConfig.sprite_size;
      this.player.pos.y = 4 * Global.globalConfig.sprite_size;
      Global.globalConfig.current_layer = 2;
      this.engine.goToScene("side");
    }
  }
}
