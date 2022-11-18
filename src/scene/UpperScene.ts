import * as ex from "excalibur";
import { PlayerUpper } from "../class/playerUpper";

export class UpperScene extends ex.Scene {
  private player: ex.Actor;

  constructor(halfDrawWidth: number, halfDrawHeigh: number) {
    super();
    this.player = new PlayerUpper(10, 10);
    this.add(this.player);
  }

  public onInitialize(engine: ex.Engine) {
    ex.Physics.useArcadePhysics();
    ex.Physics.acc = ex.vec(0, 0);
    engine.input.keyboard.on("hold", (evt) => this.handleKeyEvent(engine, evt));
    engine.input.keyboard.on("release", (evt) =>
      this.handleReleaseEvent(engine, evt)
    );
    this.player.vel.setTo(0, 0);
  }

  public handleReleaseEvent(engine: ex.Engine, evt: ex.Input.KeyEvent) {
    this.player.vel.x = 0;
    this.player.vel.y = 0;
  }

  public handleKeyEvent(engine: ex.Engine, evt: ex.Input.KeyEvent) {
    // Movements keys
    if (evt.key === ex.Input.Keys.Up) {
      if (this.player.vel.y < 200) return;
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
  }
}
