import * as ex from "excalibur";
import { Player } from "./class/player";
import { PlayerUpper } from "./class/playerUpper";
import { Ground } from "./class/ground";
import { MainGame } from "./class/game";
import { UpperScene } from "./scene/UpperScene";

MainGame.start();
MainGame.add("upper", new UpperScene());
MainGame.goToScene("upper");
