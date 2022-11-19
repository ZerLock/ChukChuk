import * as ex from "excalibur";
import { Global } from "../class/global";
import { MainGame } from "./game";
import { playerSpriteSheet } from "../resources";

export class Player extends ex.Actor {
    private canJump: boolean;
    private horizontalFlip: boolean = false;

    constructor(xPosition: number, yPosition: number) {
        super({
            x: xPosition,
            y: yPosition,
            width: Global.globalConfig.sprite_size,
            height: Global.globalConfig.sprite_size,
            color: ex.Color.Red,
            collider:ex.Shape.Box(Global.globalConfig.sprite_size, Global.globalConfig.sprite_size),
            collisionType: ex.CollisionType.Active,
            vel: ex.vec(0, 0),
            camera: new ex.Camera(),
        });
        this.canJump = false;
        this.playerImage = new ex.ImageSource('./chuck.png');
    }

    onInitialize(engine: ex.Engine) {
        // Set camera to player
        MainGame.currentScene.camera.strategy.lockToActorAxis(this, ex.Axis.X);

        // Sprites & Animations & Graphics
        const playerMoveAnim = ex.Animation.fromSpriteSheet(playerSpriteSheet, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 200);
        this.graphics.use(playerMoveAnim);
        this.graphics.add('run', playerMoveAnim);

        // Collisions events
        this.on('collisionstart', (evt) => this.handleCollisionEvent(engine, evt));
        this.on('collisionend', (evt) => this.handleEndCollisionEvent(engine, evt));

        // Keyboards events
        engine.input.keyboard.on("hold", (evt) => this.handleKeyEvent(engine, evt));
        engine.input.keyboard.on("release", (evt) => this.handleReleaseEvent(engine, evt));
    }

    private handleEndCollisionEvent(engine: ex.Engine, evt: ex.CollisionEndEvent<ex.Actor>) {
        this.canJump = false;
    }

    private handleCollisionEvent(engine: ex.Engine, evt: ex.CollisionStartEvent<ex.Actor>) {
        this.canJump = true;
    }

    private handleReleaseEvent(engine: ex.Engine, evt: ex.Input.KeyEvent): void {
        if (evt.key === ex.Input.Keys.Space) {
            // Do not stop movement when jump
            return;
        }

        this.vel.x = 0; // Stop X-axis movements
    }

    private handleKeyEvent(engine: ex.Engine, evt: ex.Input.KeyEvent): void {
        if (evt.key === ex.Input.Keys.Space) {
            // Jump
            if (this.canJump) {
                this.vel.y = -Global.globalConfig.gravity / Global.globalConfig.jump_ratio;
            }
        } else if (evt.key === ex.Input.Keys.Right) {
            // Move right
            if (this.vel.x > Global.globalConfig.player_speed) {
                return;
            }
            this.scale.x = 1;
            this.horizontalFlip = false;
            this.vel.x += Global.globalConfig.player_acceleration;
        } else if (evt.key === ex.Input.Keys.Left) {
            // Move left
            if (this.vel.x < -Global.globalConfig.player_speed) {
                return;
            }
            this.scale.x = -1;
            this.horizontalFlip = true;
            this.vel.x += -Global.globalConfig.player_acceleration;
        }
        const playerGraphic = this.graphics.getGraphic('');
        playerGraphic?.flipHorizontal = this.horizontalFlip;
    }
}
