import * as ex from "excalibur";
import { Global } from "../class/global";
import { MainGame } from "./game";
import { Images, SidePlayerIdle, SidePlayerSpriteSheet } from "../resources";

export class Player extends ex.Actor {
  private onGround: boolean = false;
  private lastDirection: 'right' | 'left' = 'right';

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
    const playerRightJump = Images.playerJump.toSprite();
    const playerLeftJump = Images.playerJump.toSprite();
    playerLeftJump.flipHorizontal = true;
    const playerRightIdle = ex.Animation.fromSpriteSheet(SidePlayerIdle, [0, 1, 2, 3], 150);
    const playerLeftIdle = ex.Animation.fromSpriteSheet(SidePlayerIdle, [0, 1, 2, 3], 150);
    playerLeftIdle.flipHorizontal = true;
    const playerRight = ex.Animation.fromSpriteSheet(SidePlayerSpriteSheet, ex.range(0, 9), 70);
    const playerLeft = ex.Animation.fromSpriteSheet(SidePlayerSpriteSheet, ex.range(0, 9), 70);
    playerLeft.flipHorizontal = true;

    // Add animations
    this.graphics.add('playerRightJump', playerRightJump);
    this.graphics.add('playerLeftJump', playerLeftJump);
    this.graphics.add('playerRightIdle', playerRightIdle);
    this.graphics.add('playerLeftIdle', playerLeftIdle);
    this.graphics.add('runRight', playerRight);
    this.graphics.add('runLeft', playerLeft);
    this.graphics.use(playerRight);

    this.on('postcollision', (evt) => this.onPostCollision(evt));
  }

  onPostUpdate() {
    // Change player animations
    if (this.vel.x < 0) {
        this.graphics.use("runLeft");
    } else if (this.vel.x > 0) {
        this.graphics.use("runRight");
    }
    if (!this.onGround || this.vel.y != 0) {
      if (this.lastDirection == 'left') {
        this.graphics.use("playerLeftJump");
      } else {
          this.graphics.use("playerRightJump");
      }
    }
  }

  onPostCollision(evt: ex.PostCollisionEvent) {
    // Set jump possibility
    if (evt.side === ex.Side.Bottom && this.vel.y === 0) {
      this.onGround = true;
    } else {
      this.onGround = false;
    }
  }

  onPreUpdate(engine: ex.Engine, delta: number) {
    // Keyboard inputs
    this.vel.x = 0;

    if (this.lastDirection == 'right') {
      this.graphics.use("playerRightIdle");
    } else {
      this.graphics.use("playerLeftIdle");
    }

    if (engine.input.keyboard.isHeld(ex.Input.Keys.Right)) {
      this.vel.x = Global.globalConfig.player_speed;
      this.lastDirection = 'right';
    }
    if (engine.input.keyboard.isHeld(ex.Input.Keys.Left)) {
      this.vel.x = -Global.globalConfig.player_speed;
      this.lastDirection = 'left';
    }
    if (engine.input.keyboard.isHeld(ex.Input.Keys.Space) && this.vel.y === 0 && this.onGround) {
      this.vel.y = -Global.globalConfig.gravity / Global.globalConfig.jump_ratio;
      this.onGround = false;
    }

    // // Death
    // if (this.pos.y > MainGame.drawHeight) {
    //   this.kill();
    //   console.log("mort");
    // }
  }
}
