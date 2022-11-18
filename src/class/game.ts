import * as ex from "excalibur";
import { UpperScene } from "../scene/UpperScene";

class Game extends ex.Engine {
  public static drawWidth = 800;
  public static drawHeight = 600;
  public static halfDrawWidth = Game.drawWidth / 2;
  public static halfDrawHeight = Game.drawHeight / 2;
  public sceneBool = false;
  public UpperScene = new UpperScene();

  constructor() {
    super({
      width: Game.drawWidth,
      height: Game.drawHeight,
      displayMode: ex.DisplayMode.FillScreen,
      backgroundColor: ex.Color.Black,
    });
    this.add("upper", this.UpperScene);
  }
  onInitialize(engine: ex.Engine) {
    engine.input.keyboard.on("press", (evt) =>
      this.handlePressedEvent(engine, evt)
    );
  }
  public handlePressedEvent(engine: ex.Engine, evt: ex.Input.KeyEvent) {
    if (evt.key === ex.Input.Keys.Space) {
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
