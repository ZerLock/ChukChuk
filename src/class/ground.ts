import * as ex from "excalibur";

export class Ground extends ex.Actor {
  constructor() {
    super({
      pos: ex.vec(0, 0),
      width: 800,
      height: 600,
      color: ex.Color.Green,
    });
  }
}
