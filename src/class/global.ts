import { globalConfig } from "../../models";

export class Global {
  static globalConfig: globalConfig = {
    sprite_size: 64,
    platformer: true,
    gravity: 1200,
    player_speed: 500,
    player_acceleration: 30,
    jump_ratio: 2.4,
    current_layer: 2,
    glitchness: 0,
    player_pos: {
      x: 7,
      y: 8,
      z: 0,
    },
    hasPumpkin: false,
    pumpkin_pos: {
      x: 20,
      y: 11,
      z: 0,
    }
  };
}
