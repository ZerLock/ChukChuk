import * as ex from "excalibur";
import { PlayerUpper } from "../class/playerUpper";
import { UpperPlayerSpriteSheetStopped, blocksSpriteSheet } from "../resources";
import map from "../maps/map1.json";
import { getSpritesToDisplay, Views } from "../utils/map";
import { getSprite } from "../utils/sprite";
import { Global } from "../class/global";

export class UpperScene extends ex.Scene {
  private player: ex.Actor;
  public lastDirection: string = "down";

  constructor(halfDrawWidth: number, halfDrawHeigh: number) {
    super();
    this.player = new PlayerUpper(10, 10);
    this.printUpperMap(2);
    this.add(this.player);
  }

  public onInitialize(engine: ex.Engine) {
    ex.Physics.useArcadePhysics();
    ex.Physics.acc = ex.vec(0, 0);
    engine.input.keyboard.on("hold", (evt) => this.handleKeyEvent(engine, evt));
    engine.input.keyboard.on("release", (evt) =>
      this.handleReleaseEvent(engine, evt)
    );
  }

  public handleReleaseEvent(engine: ex.Engine, evt: ex.Input.KeyEvent) {
    this.player.vel.x = 0;
    this.player.vel.y = 0;
    this.handleStopMovement(engine, evt);
  }

  public handleKeyEvent(engine: ex.Engine, evt: ex.Input.KeyEvent) {
    // Movements keys
    if (evt.key === ex.Input.Keys.Up) {
      if (this.player.vel.y < -200) return;
      this.player.vel.y += -10;
    } else if (evt.key === ex.Input.Keys.Down) {
      if (this.player.vel.y > 200) return;
      this.player.vel.y += 10;
    } else if (evt.key === ex.Input.Keys.Right) {
      if (this.player.vel.x > 200) return;
      this.player.vel.x += 10;
    } else if (evt.key === ex.Input.Keys.Left) {
      if (this.player.vel.x < -200) return;
      this.player.vel.x += -10;
    } else {
      this.player.vel.setTo(0, 0);
    }

    // check player velocity
    if (this.player.vel.x > 0) {
      this.player.graphics.hide();
      this.player.graphics.use("moveRight");
      this.lastDirection = "right";
    } else if (this.player.vel.x < 0) {
      this.player.graphics.hide();

      this.player.graphics.show("moveLeft");
      this.lastDirection = "left";
    } else if (this.player.vel.y > 0) {
      this.player.graphics.hide();

      this.player.graphics.show("moveDown");
      this.lastDirection = "down";
    } else if (this.player.vel.y < 0) {
      this.player.graphics.hide();
      this.player.graphics.show("moveUp");
      this.lastDirection = "up";
    }
  }

  public handleStopMovement(engine: ex.Engine, evt: ex.Input.KeyEvent) {
    if (this.lastDirection === "down") {
      this.player.graphics.hide();
      this.player.graphics.show(UpperPlayerSpriteSheetStopped.sprites[0]);
    } else if (this.lastDirection === "left") {
      this.player.graphics.hide();

      this.player.graphics.show(UpperPlayerSpriteSheetStopped.sprites[1]);
    } else if (this.lastDirection === "right") {
      this.player.graphics.hide();

      this.player.graphics.show(UpperPlayerSpriteSheetStopped.sprites[2]);
    } else if (this.lastDirection === "up") {
      this.player.graphics.hide();
      this.player.graphics.show(UpperPlayerSpriteSheetStopped.sprites[3]);
    } else {
      this.player.graphics.show(UpperPlayerSpriteSheetStopped.sprites[0]);
    }
  }

  public printUpperMap(layer: number) {
    const mapper = getSpritesToDisplay(map, Views.Upper);
    const toMap =
      layer === 0
        ? mapper.underPlayer
        : layer === 1
        ? mapper.playerLayer
        : mapper.overPlayer;
    toMap.forEach((element) => {
      const sprite = getSprite(element.id, Views.Upper);
      const block = new ex.Actor({
        pos: ex.vec(
          element.x * Global.globalConfig.sprite_size,
          element.y * Global.globalConfig.sprite_size
        ),
        width: Global.globalConfig.sprite_size,
        height: Global.globalConfig.sprite_size,
        collisionType: sprite.agressive
          ? ex.CollisionType.Fixed
          : ex.CollisionType.Passive,
        color: ex.Color.Green,
      });
      const spriteToDraw = blocksSpriteSheet.sprites[sprite.y * 32 + sprite.x];
      spriteToDraw.height = Global.globalConfig.sprite_size;
      spriteToDraw.width = Global.globalConfig.sprite_size;
      block.graphics.use(spriteToDraw);
      this.add(block);
    });
  }
}
