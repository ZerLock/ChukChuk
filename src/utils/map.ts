import { Global } from '../class/global';

export enum Views {
    Upper = 'upper',
    Side = 'side',
}

interface Sprite {
    x: number;
    y: number;
    id: string;
}

interface MapData {
    width: number;
    height: number;
    tiles: Sprite[];
}

interface SpriteLayers {
    underPlayer: Sprite[];
    playerLayer: Sprite[];
    overPlayer: Sprite[];
}

const sideViewSprites = (map: MapData[]): SpriteLayers => {
    const layer = Global.globalConfig.current_layer;
    return { underPlayer: [], playerLayer: map[layer].tiles, overPlayer: [] };
};

const upperViewSprites = (map: MapData[]): SpriteLayers => {
    const yPos = Global.globalConfig.player_pos.y;
    const underPlayer: Sprite[] = [];
    const playerLayer: Sprite[] = [];
    const overPlayer: Sprite[] = [];

    for (let i = 0; i < map.length; i++) {
        const layer = map[i].tiles.sort((a, b) => a.y - b.y).filter((sprite, index, self) => {
            return sprite.y === yPos || self.findIndex((s) => s.x === sprite.x) === index;
        });
        for (const sprite of layer) {
            const newSprite = { x: sprite.x, y: i, id: sprite.id }
            if (sprite.y < yPos) {
                underPlayer.push(newSprite);
            } else if (sprite.y === yPos) {
                playerLayer.push(newSprite);
            } else {
                overPlayer.push(newSprite);
            }
        }
    }
    return { underPlayer, playerLayer, overPlayer };
};

export const getSpritesToDisplay = (map: MapData[], view: Views): SpriteLayers => {
    if (view === Views.Side) {
        return sideViewSprites(map);
    }
    return upperViewSprites(map);
}