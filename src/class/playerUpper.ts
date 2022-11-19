import * as ex from "excalibur";
import { MainGame } from "./game";
import {
  UpperPlayerSpriteSheet,
  UpperPlayerSpriteSheetStopped,
} from "../resources";

export class PlayerUpper extends ex.Actor {
  constructor(xPosition: number, yPosition: number) {
    super({
      x: xPosition,
      y: yPosition,
      width: 16,
      height: 16,
      color: ex.Color.Red,
      collisionType: ex.CollisionType.Active,
      camera: new ex.Camera(),
    });
  }
  onInitialize(engine: ex.Engine) {
    MainGame.currentScene.camera.strategy.lockToActorAxis(this, ex.Axis.X);
    const playerMoveAnimDown = ex.Animation.fromSpriteSheet(
      UpperPlayerSpriteSheet,
      [0, 1, 2, 3],
      100
    );
    const playerMoveAnimLeft = ex.Animation.fromSpriteSheet(
      UpperPlayerSpriteSheet,
      [4, 5, 6, 7],
      100
    );
    const playerMoveAnimRight = ex.Animation.fromSpriteSheet(
      UpperPlayerSpriteSheet,
      [8, 9, 10, 11],
      100
    );
    const playerMoveAnimUp = ex.Animation.fromSpriteSheet(
      UpperPlayerSpriteSheet,
      [12, 13, 14, 15],
      100
    );

    this.graphics.add("moveDown", playerMoveAnimDown);
    this.graphics.add("moveUp", playerMoveAnimUp);
    this.graphics.add("moveLeft", playerMoveAnimLeft);
    this.graphics.add("moveRight", playerMoveAnimRight);
    this.graphics.use(UpperPlayerSpriteSheetStopped.sprites[0]);
  }
}
