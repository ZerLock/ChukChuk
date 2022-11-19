export interface Sprite {
    x: number;
    y: number;
    collision: boolean;
    agressive: boolean;
    upper: string;
}

export type Sprites = {[id: string]: Sprite}

export interface spritesheet {
    spritesheet: Array<Sprites>;
}
