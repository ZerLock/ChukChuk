import * as ex from "excalibur";
import { Global } from '../class/global';
import { UpperScene } from "../scene/UpperScene";
import { SideScene } from "../scene/SideScene";
import { Views } from "../utils/map";

class Game extends ex.Engine {
    public static drawWidth = window.innerWidth;
    public static drawHeight = window.innerHeight;
    public static halfDrawWidth = Game.drawWidth / 2;
    public static halfDrawHeight = Game.drawHeight / 2;
    public scene = Views.Side;
    public UpperScene = new UpperScene(this.halfDrawWidth, this.halfDrawHeight);
    public SideScene = new SideScene(this.halfDrawWidth, this.halfDrawHeight);

    constructor() {
        super({
            width: Game.drawWidth,
            height: Game.drawHeight,
            resolution: {
                width: Game.drawWidth,
                height: Game.drawHeight,
            },
            backgroundColor: ex.Color.Blue,
            antialiasing: false, // For pixel art
        });
        this.add("upper", this.UpperScene);
        this.add("side", this.SideScene);
    }

    onInitialize(engine: ex.Engine) {
        this.goToScene(this.scene);
        engine.input.keyboard.on("press", (evt) =>
            this.handlePressedEvent(engine, evt)
        );
    }

    public handlePressedEvent(engine: ex.Engine, evt: ex.Input.KeyEvent) {
        if (evt.key == ex.Input.Keys.Enter) {
            // fade out
            engine.currentScene.camera.zoomOverTime(3, 1000);
            setTimeout(() => {
                this.goToScene(this.scene);
                engine.currentScene.camera.zoom = 3;
                engine.currentScene.camera.zoomOverTime(1, 1000);
            }, 1000);
            this.scene = this.scene == Views.Side ? Views.Upper : Views.Side;
        }
    }
}

export const MainGame = new Game();
