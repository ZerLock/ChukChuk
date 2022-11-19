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
            collider:ex.Shape.Circle(Global.globalConfig.sprite_size / 2),
            collisionType: ex.CollisionType.Active,
            vel: ex.vec(0, 0),
            camera: new ex.Camera(),
        });
        this.canJump = false;
    }

    onInitialize(engine: ex.Engine) {
        // Set camera to player
        MainGame.currentScene.camera.strategy.lockToActorAxis(this, ex.Axis.X);

        // Sprites & Animations & Graphics
        const playerMoveAnim = ex.Animation.fromSpriteSheet(playerSpriteSheet, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 100);
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
        }
        if (evt.key === ex.Input.Keys.Right) {
            if (this.vel.x > Global.globalConfig.player_speed) {
                return;
            }
            this.horizontalFlip = false;
            this.vel.x += Global.globalConfig.player_acceleration;
        }
        if (evt.key === ex.Input.Keys.Left) {
            if (this.vel.x < -Global.globalConfig.player_speed) {
                return;
            }
            this.horizontalFlip = true;
            this.vel.x += -Global.globalConfig.player_acceleration;
        }
        if (this.graphics.getGraphic('run') != undefined) {
            this.graphics.getGraphic('run')!.flipHorizontal = this.horizontalFlip;
        }
    }
}
