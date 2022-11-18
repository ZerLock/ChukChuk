import * as ex from "excalibur";

export class Player extends ex.Actor {
  constructor() {
    super({
      x: 10,
      y: 10,
      width: 20,
      height: 20,
      color: ex.Color.Red,
      collisionType: ex.CollisionType.Active,
    });
  }
  // Player movement
  update(engine: ex.Engine, delta: number) {
    super.update(engine, delta);
    if (engine.input.keyboard.isHeld(ex.Input.Keys.Left)) {
      this.vel.x = -100;
    } else if (engine.input.keyboard.isHeld(ex.Input.Keys.Right)) {
      this.vel.x = 100;
    } else if (engine.input.keyboard.isHeld(ex.Input.Keys.Up)) {
      this.vel.y = -100;
    } else if (engine.input.keyboard.isHeld(ex.Input.Keys.Down)) {
      this.vel.y = 100;
    } else {
      this.vel.y = 0;
      this.vel.x = 0;
    }
  }
}
