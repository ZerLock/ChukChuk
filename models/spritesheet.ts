export interface Sprite {
    id: number;
}

type Sprites = {[id: string]: Sprite}

export interface spritesheet {
    spritesheet: Array<Sprites>;
}
