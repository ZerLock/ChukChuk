import * as ex from "excalibur";
import { Global } from "../class/global";
import { Player } from "../class/player";

export class SideScene extends ex.Scene {
  private player: Player;

  constructor(halfDrawWidth: number, halfDrawHeigh: number) {
    super();
    this.player = new Player(10, 10);
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

  onInitialize(engine: ex.Engine): void {
    ex.Physics.useArcadePhysics();
    ex.Physics.acc = ex.vec(0, Global.globalConfig.gravity);
    engine.input.keyboard.on("hold", (evt) => this.handleKeyEvent(engine, evt));
    engine.input.keyboard.on("release", (evt) =>
      this.handleReleaseEvent(engine, evt)
    );
    this.player.vel.setTo(0, 0);
  }

  handleReleaseEvent(engine: ex.Engine, evt: ex.Input.KeyEvent): void {
    if (evt.key === ex.Input.Keys.Space) {
      // Do not stop movement when jump
      return;
    }

    this.player.vel.x = 0; // Stop X-axis movements
  }

  handleKeyEvent(engine: ex.Engine, evt: ex.Input.KeyEvent): void {
    if (evt.key === ex.Input.Keys.Space) {
      // Jump
      this.player.vel.y = -Global.globalConfig.gravity;
    } else if (evt.key === ex.Input.Keys.Right) {
      // Move right
      if (this.player.vel.x > Global.globalConfig.player_speed) return;
      this.player.vel.x += 10;
    } else if (evt.key === ex.Input.Keys.Left) {
      // Move left
      if (this.player.vel.x < -Global.globalConfig.player_speed) return;
      this.player.vel.x += -10;
    }
  }
}
