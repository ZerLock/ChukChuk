import * as ex from "excalibur";
import { Game } from "./game";

export const Ground = new ex.Actor({
  pos: ex.vec(Game.halfDrawWidth, Game.drawHeight),
  width: Game.drawWidth,
  height: 100,
  color: ex.Color.DarkGray,
  collisionType: ex.CollisionType.Fixed,
});
