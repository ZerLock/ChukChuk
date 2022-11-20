import { Position } from ".";

export interface globalConfig {
    sprite_size: number; // Sprite size
    platformer: boolean; // Is plateform scene or upper scene
    gravity: number;
    player_speed: number;
    player_acceleration: number;
    jump_ratio: number;
    current_layer: number;
    glitchness: number;
    player_pos: Position;
    hasPumpkin: boolean;
    pumpkin_pos: Position;
}
