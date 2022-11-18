import * as ex from "excalibur";

export class Player extends ex.Actor {
  constructor(xPosition: number, yPosition: number) {
    super({
      x: xPosition,
      y: yPosition,
      width: 16,
      height: 16,
      color: ex.Color.Red,
      collisionType: ex.CollisionType.Active,
      vel: ex.vec(0, 0),
    });
  }
}
