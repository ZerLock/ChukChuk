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
    this.player.vel.setTo(0, 0);
  }
}
