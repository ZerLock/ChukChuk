import * as ex from "excalibur";
import { Global } from "../class/global";
import { MainGame } from "./game";
import { SidePlayerSpriteSheet } from "../resources";

export class Player extends ex.Actor {
  private onGround: boolean = false;

  constructor(xPosition: number, yPosition: number) {
    super({
      x: xPosition,
      y: yPosition,
      width: Global.globalConfig.sprite_size,
      height: Global.globalConfig.sprite_size,
      color: ex.Color.Red,
      collider: ex.Shape.Box(
        Global.globalConfig.sprite_size,
        Global.globalConfig.sprite_size,
        ex.Vector.Half,
        ex.vec(0, -1),
      ),
      collisionType: ex.CollisionType.Active,
      vel: ex.vec(0, 0),
      camera: new ex.Camera(),
    });
  }

  onInitialize(engine: ex.Engine) {
    // Set camera to player
    MainGame.currentScene.camera.strategy.lockToActorAxis(this, ex.Axis.X);

    // Sprites & Animations & Graphics
    const playerRight = ex.Animation.fromSpriteSheet(SidePlayerSpriteSheet, ex.range(0, 9), 100);
    const playerLeft = ex.Animation.fromSpriteSheet(SidePlayerSpriteSheet, ex.range(0, 9), 100);
    playerLeft.flipHorizontal = true;

    // Add animations
    this.graphics.add('runRight', playerRight);
    this.graphics.add('runLeft', playerLeft);
    this.graphics.use(playerRight);

    this.on('postcollision', (evt) => this.onPostCollision(evt));
  }

  onPostUpdate() {
    if (this.vel.x < 0) {
        this.graphics.use("runLeft");
    } else if (this.vel.x > 0) {
        this.graphics.use("runRight");
    }
  }

  onPostCollision(evt: ex.PostCollisionEvent) {
    if (evt.side === ex.Side.Bottom) {
      this.onGround = true;
    } else {
      this.onGround = false;
    }
  }

  onPreUpdate(engine: ex.Engine, delta: number) {
    this.vel.x = 0;

    if (engine.input.keyboard.isHeld(ex.Input.Keys.Right)) {
      this.vel.x = Global.globalConfig.player_speed;
    }
    if (engine.input.keyboard.isHeld(ex.Input.Keys.Left)) {
      this.vel.x = -Global.globalConfig.player_speed;
    }
    if (engine.input.keyboard.isHeld(ex.Input.Keys.Space) && this.onGround) {
      this.vel.y = -Global.globalConfig.gravity / Global.globalConfig.jump_ratio;
      this.onGround = false;
    }
  }
}
