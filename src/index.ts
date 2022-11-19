import * as ex from "excalibur";
import { MainGame } from "./class/game";
import { loader } from "./resources";

loader.playButtonText = "Start ChukChuk";

MainGame.start(loader).then(() => {
  MainGame.goToScene("side");
});
