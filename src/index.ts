import * as ex from "excalibur";
import { Player } from "./class/player";
import { Ground } from "./class/ground";
import { Game } from "./class/game";

const player = new Player();
ex.Physics.useRealisticPhysics();
ex.Physics.acc = ex.vec(0, 500);
Game.start();
Game.add(player);
Game.add(Ground);
