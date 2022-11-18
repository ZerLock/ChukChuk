import * as ex from "excalibur";

export class PlayerUpper extends ex.Actor {
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

  onInitialize(engine: ex.Engine) {
    console.log("initialized");
    engine.input.keyboard.on("hold", (evt) => this.handleKeyEvent(engine, evt));
    engine.input.keyboard.on("release", (evt) =>
      this.handleReleaseEvent(engine, evt)
    );
  }

  handleReleaseEvent(engine: ex.Engine, evt: ex.Input.KeyEvent) {
    this.vel.x = 0;
  }

  handleKeyEvent(engine: ex.Engine, evt: ex.Input.KeyEvent) {
    // Movements keys
    if (evt.key === ex.Input.Keys.Up) {
      this.vel.y = -10;
    } else if (evt.key === ex.Input.Keys.Down) {
      if (this.vel.y > 200) return;
      this.vel.y += 10;
    } else if (evt.key === ex.Input.Keys.Right) {
      if (this.vel.x > 200) return;
      this.vel.x += 10;
    } else if (evt.key === ex.Input.Keys.Left) {
      if (this.vel.x < -200) return;
      this.vel.x += -10;
    } else {
      this.vel.setTo(0, 0);
    }
  }
}
