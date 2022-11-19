import * as ex from 'excalibur';
import { Global } from './class/global';

const Images: { [key: string]: ex.ImageSource } = {
    player: new ex.ImageSource('./chuck.png'),
    blocks: new ex.ImageSource('./blocks.png'),
};

const playerSpriteSheet = ex.SpriteSheet.fromImageSource({
    image: Images.player,
    grid: {
        rows: 1,
        columns: 10,
        spriteHeight: Global.globalConfig.sprite_size,
        spriteWidth: Global.globalConfig.sprite_size,
    },
});

const blocksSpriteSheet = ex.SpriteSheet.fromImageSource({
    image: Images.blocks,
    grid: {
        rows: 32,
        columns: 32,
        spriteHeight: 16,
        spriteWidth: 16,
    },
});

const loader = new ex.Loader();
const allResources = {...Images};
for (const res in allResources) {
    loader.addResource(allResources[res]);
}

export { Images, loader, playerSpriteSheet, blocksSpriteSheet };
