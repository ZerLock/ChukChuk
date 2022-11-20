import * as ex from "excalibur";
import { Global } from "../class/global";
import { MainGame } from "./game";
import { Images, PlayerJumpSpriteSheet, SidePlayerIdle, SidePlayerSpriteSheet, SidePumpchukSpriteSheet, SidePumpkinIdle, SidePumpkinJump } from "../resources";

export class Player extends ex.Actor {
  private onGround: boolean = false;
  private lastDirection: "right" | "left" = "right";

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
        ex.vec(0, -1)
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
    const playerRightIdle = ex.Animation.fromSpriteSheet(SidePlayerIdle, [0, 1, 2, 3], 150);
    const playerLeftIdle = ex.Animation.fromSpriteSheet(SidePlayerIdle, [0, 1, 2, 3], 150);
    playerLeftIdle.flipHorizontal = true;
    const playerRight = ex.Animation.fromSpriteSheet(
      SidePlayerSpriteSheet,
      ex.range(0, 9),
      70
    );
    const playerLeft = ex.Animation.fromSpriteSheet(
      SidePlayerSpriteSheet,
      ex.range(0, 9),
      70
    );
    playerLeft.flipHorizontal = true;
    const pumpkinRunRight = ex.Animation.fromSpriteSheet(SidePumpchukSpriteSheet, ex.range(0, 8), 70);
    const pumpkinRunLeft = ex.Animation.fromSpriteSheet(SidePumpchukSpriteSheet, ex.range(0, 8), 70);
    pumpkinRunLeft.flipHorizontal = true;
    const pumpkinIdleRight = ex.Animation.fromSpriteSheet(SidePumpkinIdle, ex.range(0, 3), 150);
    const pumpkinIdleLeft = ex.Animation.fromSpriteSheet(SidePumpkinIdle, ex.range(0, 3), 150);
    pumpkinIdleLeft.flipHorizontal = true;

    // Jump
    const pumpkinJumpHighRight = SidePumpkinJump.sprites[0];
    const pumpkinJumpLowRight = SidePumpkinJump.sprites[1];
    const pumpkinJumpHighLeft = SidePumpkinJump.sprites[0].clone();
    const pumpkinJumpLowLeft = SidePumpkinJump.sprites[1].clone();
    pumpkinJumpHighLeft.flipHorizontal = true;
    pumpkinJumpLowLeft.flipHorizontal = true;

    const playerJumpHighRight = PlayerJumpSpriteSheet.sprites[0];
    const playerJumpLowRight = PlayerJumpSpriteSheet.sprites[1];
    const playerJumpHighLeft = PlayerJumpSpriteSheet.sprites[0].clone();
    const playerJumpLowLeft = PlayerJumpSpriteSheet.sprites[1].clone();
    playerJumpHighLeft.flipHorizontal = true;
    playerJumpLowLeft.flipHorizontal = true;

    // Add animations
    this.graphics.add('playerRightIdle', playerRightIdle);
    this.graphics.add('playerLeftIdle', playerLeftIdle);
    this.graphics.add('runRight', playerRight);
    this.graphics.add('runLeft', playerLeft);
    this.graphics.add('pumpkinRight', pumpkinRunRight);
    this.graphics.add('pumpkinLeft', pumpkinRunLeft);
    this.graphics.add('pumpkinIdleRight', pumpkinIdleRight);
    this.graphics.add('pumpkinIdleLeft', pumpkinIdleLeft);

    this.graphics.add('pumpkinJumpHighRight', pumpkinJumpHighRight);
    this.graphics.add('pumpkinJumpLowRight', pumpkinJumpLowRight);
    this.graphics.add('pumpkinJumpHighLeft', pumpkinJumpHighLeft);
    this.graphics.add('pumpkinJumpLowLeft', pumpkinJumpLowLeft);

    this.graphics.add('playerJumpHighRight', playerJumpHighRight);
    this.graphics.add('playerJumpLowRight', playerJumpLowRight);
    this.graphics.add('playerJumpHighLeft', playerJumpHighLeft);
    this.graphics.add('playerJumpLowLeft', playerJumpLowLeft);

    if (Global.globalConfig.hasPumpkin) {
      this.graphics.use(pumpkinRunRight);
    } else {
      this.graphics.use(playerRight);
    }

    this.on("postcollision", (evt) => this.onPostCollision(evt));
  }

  onPostUpdate() {
    // Change player animations
    if (this.vel.x < 0) {
          this.graphics.use(Global.globalConfig.hasPumpkin ? "pumpkinLeft" : "runLeft");
    } else if (this.vel.x > 0) {
        this.graphics.use(Global.globalConfig.hasPumpkin ? "pumpkinRight" : "runRight");
    }

    // Jump
    if (!this.onGround || this.vel.y != 0) {
      if (this.lastDirection == 'left') {
        if (this.vel.y < 0) {
          this.graphics.use(Global.globalConfig.hasPumpkin ? "pumpkinJumpHighLeft" : "playerJumpHighLeft");
        } else {
          this.graphics.use(Global.globalConfig.hasPumpkin ? "pumpkinJumpLowLeft" : "playerJumpLowLeft")
        }
      } else {
        if (this.vel.y < 0) {
          this.graphics.use(Global.globalConfig.hasPumpkin ? "pumpkinJumpHighRight" : "playerJumpHighRight");
        } else {
          this.graphics.use(Global.globalConfig.hasPumpkin ? "pumpkinJumpLowRight" : "playerJumpLowRight")
        }
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
      this.graphics.use(Global.globalConfig.hasPumpkin ? "pumpkinIdleRight" : "playerRightIdle");
    } else {
      this.graphics.use(Global.globalConfig.hasPumpkin ? "pumpkinIdleLeft" : "playerLeftIdle");
    }

    if (
      engine.input.keyboard.isHeld(ex.Input.Keys.Right) ||
      engine.input.keyboard.isHeld(ex.Input.Keys.D)
    ) {
      this.vel.x = Global.globalConfig.player_speed;
      this.lastDirection = "right";
    }
    if (
      engine.input.keyboard.isHeld(ex.Input.Keys.Left) ||
      engine.input.keyboard.isHeld(ex.Input.Keys.A)
    ) {
      this.vel.x = -Global.globalConfig.player_speed;
      this.lastDirection = "left";
    }
    if (
      engine.input.keyboard.isHeld(ex.Input.Keys.Space) &&
      this.vel.y === 0 &&
      this.onGround
    ) {
      this.vel.y =
        -Global.globalConfig.gravity / Global.globalConfig.jump_ratio;
      this.onGround = false;
    }
  }
}
