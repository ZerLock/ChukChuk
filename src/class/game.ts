import * as ex from "excalibur";
import { UpperScene } from "../scene/UpperScene";
import { SideScene } from "../scene/SideScene";
import { EndingScene } from "../scene/EndingScene";
import { Views } from "../utils/map";
import { mapArray } from "resources";
import { Global } from "./global";

class Game extends ex.Engine {
    public static drawWidth = window.innerWidth;
    public static drawHeight = window.innerHeight;
    public static halfDrawWidth = Game.drawWidth / 2;
    public static halfDrawHeight = Game.drawHeight / 2;
    public scene = Views.Side;
    public UpperScene = new UpperScene(this.halfDrawWidth, this.halfDrawHeight);
    public SideScene = new SideScene(this.halfDrawWidth, this.halfDrawHeight);
    public EndingScene = new EndingScene(this.halfDrawWidth, this.halfDrawHeight);

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
            maxFps: 60,
        });

        this.add("upper", this.UpperScene);
        this.add("side", this.SideScene);
        this.add("ending", this.EndingScene);
    }

    onInitialize(engine: ex.Engine) {
        engine.input.keyboard.on("press", (evt) =>
            this.handlePressedEvent(engine, evt)
        );
        this.goToScene(this.scene);
    }

    public handlePressedEvent(engine: ex.Engine, evt: ex.Input.KeyEvent) {
        if (evt.key == ex.Input.Keys.Enter) {
            // fade out
            engine.currentScene.camera.zoomOverTime(3, 1000);
            Global.globalConfig.glitchness += 0.1;
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
