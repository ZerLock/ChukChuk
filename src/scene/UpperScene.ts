import * as ex from "excalibur";
import { PlayerUpper } from "../class/playerUpper";
import { UpperPlayerSpriteSheetStopped } from "../resources";
import map from "../maps/map1.json";
import { getSpritesToDisplay, Views } from "../utils/map";

export class UpperScene extends ex.Scene {
  private player: ex.Actor;
  public lastDirection: string = "down";

  constructor(halfDrawWidth: number, halfDrawHeigh: number) {
    super();
    this.player = new PlayerUpper(10, 10);
    this.add(this.player);
    this.add(
      new ex.Actor({
        pos: ex.vec(halfDrawWidth / 2, halfDrawHeigh * 2),
        width: 800,
        height: 600,
        collisionType: ex.CollisionType.Fixed,
        color: ex.Color.Green,
      })
    );
  }

  public onInitialize(engine: ex.Engine) {
    ex.Physics.useArcadePhysics();
    ex.Physics.acc = ex.vec(0, 0);
    engine.input.keyboard.on("hold", (evt) => this.handleKeyEvent(engine, evt));
    engine.input.keyboard.on("release", (evt) =>
      this.handleReleaseEvent(engine, evt)
    );
    const a = getSpritesToDisplay(map, Views.Upper);
    console.log(a);
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
}
