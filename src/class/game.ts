import * as ex from "excalibur";

export const Game = new ex.Engine({
  width: 600,
  height: 400,
  displayMode: ex.DisplayMode.FillScreen,
  maxFps: 60,
});
