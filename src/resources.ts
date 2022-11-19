import * as ex from 'excalibur';
import { Global } from './class/global';

const Images: { [key: string]: ex.ImageSource } = {
    player: new ex.ImageSource('./chuck.png'),
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

const loader = new ex.Loader();
const allResources = {...Images};
for (const res in allResources) {
    loader.addResource(allResources[res]);
}

export { Images, loader, playerSpriteSheet };
