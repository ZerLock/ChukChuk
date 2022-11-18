import * as ex from "excalibur";
import { UpperScene } from "../scene/UpperScene";
import { SideScene } from "../scene/SideScene";

class Game extends ex.Engine {
  public static drawWidth = 800;
  public static drawHeight = 600;
  public static halfDrawWidth = Game.drawWidth / 2;
  public static halfDrawHeight = Game.drawHeight / 2;
  public sceneBool = false;
  public UpperScene = new UpperScene(this.halfDrawWidth, this.halfDrawHeight);
  public SideScene = new SideScene(this.halfDrawWidth, this.halfDrawHeight);

  constructor() {
    super({
      width: Game.drawWidth,
      height: Game.drawHeight,
      displayMode: ex.DisplayMode.FillScreen,
      backgroundColor: ex.Color.Blue,
    });
    this.add("upper", this.UpperScene);
    this.add("side", this.SideScene);
  }
  onInitialize(engine: ex.Engine) {
    engine.input.keyboard.on("press", (evt) =>
      this.handlePressedEvent(engine, evt)
    );
  }
  public handlePressedEvent(engine: ex.Engine, evt: ex.Input.KeyEvent) {
    if (evt.key === ex.Input.Keys.Enter) {
      console.log("space");
      if (this.sceneBool) {
        this.goToScene("upper");
        this.sceneBool = false;
      } else {
        this.goToScene("side");
        this.sceneBool = true;
      }
    }
  }
}
export const MainGame = new Game();
