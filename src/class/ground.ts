import * as ex from "excalibur";

export class Ground extends ex.Actor {
  constructor() {
    super({
      color: ex.Color.Black,
      collisionType: ex.CollisionType.Fixed,
    });
  }
}
