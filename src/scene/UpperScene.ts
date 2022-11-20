import * as ex from "excalibur";
import { PlayerUpper } from "../class/playerUpper";
import { UpperPlayerSpriteSheetStopped, blocksSpriteSheet } from "../resources";
import map from "../maps/level1-4.json";
import { getSpritesToDisplay, SpriteData, Views } from "../utils/map";
import { getSprite } from "../utils/sprite";
import { Global } from "../class/global";

export class UpperScene extends ex.Scene {
  private player: ex.Actor;
  public lastDirection: string = "down";
  public deltaHeight =
    window.innerHeight / 2 - Global.globalConfig.sprite_size * 2;
  public blockWidth = window.innerWidth / 5;

  constructor(halfDrawWidth: number, halfDrawHeigh: number) {
    super();
    this.player = new PlayerUpper(10, 10);
  }

  public onActivate(_context: ex.SceneActivationContext<unknown>): void {
    ex.Physics.useArcadePhysics();
    ex.Physics.acc = ex.vec(0, 0);
    const player_pos = Global.globalConfig.player_pos;
    player_pos.x *= Global.globalConfig.sprite_size;
    if (!this.player.isKilled()) {
      this.player.kill();
    }
    this.player = new PlayerUpper(
      player_pos.x,
      (4 - Global.globalConfig.current_layer) *
      Global.globalConfig.sprite_size +
      this.deltaHeight
    );
    const mapper = getSpritesToDisplay(map, Views.Upper);
    this.printUpperMap(mapper["underPlayer"], "underPlayer");
    this.add(this.player);
    this.printUpperMap(mapper["playerLayer"], "playerLayer");
    this.printUpperMap(mapper["overPlayer"], "overPlayer");
  }

  public onDeactivate(_context: ex.SceneActivationContext<undefined>): void {
    const sprite_size = Global.globalConfig.sprite_size;

    Global.globalConfig.current_layer = Math.min(
      4,
      3 - Math.floor((this.player.pos.y - this.deltaHeight - 25) / sprite_size)
    );
    Global.globalConfig.player_pos.x = Math.round(
      this.player.pos.x / sprite_size
    );
    this.clear();
  }

  public onInitialize(engine: ex.Engine) {
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
    // Movements key
    const speed = Global.globalConfig.player_speed;
    const acc = Global.globalConfig.player_acceleration;

    if (evt.key === ex.Input.Keys.Up || evt.key === ex.Input.Keys.W) {
      if (this.player.vel.y < -speed) return;
      this.player.vel.y += -acc;
    } else if (evt.key === ex.Input.Keys.Down || evt.key === ex.Input.Keys.S) {
      if (this.player.vel.y > speed) return;
      this.player.vel.y += acc;
    } else if (evt.key === ex.Input.Keys.Right || evt.key === ex.Input.Keys.D) {
      if (this.player.vel.x > speed) return;
      this.player.vel.x += acc;
    } else if (evt.key === ex.Input.Keys.Left || evt.key === ex.Input.Keys.A) {
      if (this.player.vel.x < -speed) return;
      this.player.vel.x += -acc;
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

  public printUpperMap(toMap: SpriteData[], layer: string) {
    let maxX = 0;
    toMap.forEach((element) => {
      if (element.x > maxX) {
        maxX = element.x;
      }
      const sprite = getSprite(element.id, Views.Upper);
      const block = new ex.Actor({
        pos: ex.vec(
          element.x * Global.globalConfig.sprite_size,
          (4 - element.y) * Global.globalConfig.sprite_size + this.deltaHeight
        ),
        width: Global.globalConfig.sprite_size,
        height: Global.globalConfig.sprite_size,

        collisionType: layer === "playerLayer"
            ? ex.CollisionType.Fixed
            : ex.CollisionType.PreventCollision,
      });
      // resize sprite
      const spriteToDraw = blocksSpriteSheet.sprites[sprite.y * 32 + sprite.x];
      spriteToDraw.height = Global.globalConfig.sprite_size;
      spriteToDraw.width = Global.globalConfig.sprite_size;
      block.graphics.use(spriteToDraw);
      if (layer !== "underPlayer") {
        const darkOverlay = spriteToDraw.clone();
        darkOverlay.tint = new ex.Color(0, 0, 0, (15 - (element.altitude ?? 0)) / 15);
        block.graphics.add(darkOverlay);
      }
      // kill player on aggressive sprite
      if (sprite.agressive) {
        block.on("precollision", (evt) => {
          if (evt.other === this.player) {
            this.player.kill();
          }
        });
      }
      this.add(block);
    });
    if (layer === "underPlayer") {
      toMap.forEach((element) => {
        if (!toMap.find((e) => e.x === element.x + 1 && e.y === element.y))
          this.invisibleWall(element.x + 1, element.y);
        if (!toMap.find((e) => e.x === element.x - 1 && e.y === element.y))
          this.invisibleWall(element.x - 1, element.y);
        if (!toMap.find((e) => e.x === element.x && e.y === element.y + 1))
          this.invisibleWall(element.x, element.y + 1);
        if (!toMap.find((e) => e.x === element.x && e.y === element.y - 1))
          this.invisibleWall(element.x, element.y - 1);
      });
    }
  }

  public invisibleWall(x: number, y: number) {
    const wall = new ex.Actor({
      pos: ex.vec(
        x * Global.globalConfig.sprite_size,
        (4 - y) * Global.globalConfig.sprite_size + this.deltaHeight
      ),
      width: Global.globalConfig.sprite_size,
      height: Global.globalConfig.sprite_size,
      collisionType: ex.CollisionType.Fixed,
    });
    this.add(wall);
  }
}
