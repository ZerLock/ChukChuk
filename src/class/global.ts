import { globalConfig } from "../../models";

export class Global {
    static globalConfig: globalConfig = {
        sprite_size: 16,
        platformer: true,
        gravity: 500,
        player_speed: 300,
        current_layer: 0,
    }
}