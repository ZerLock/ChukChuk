import * as ex from 'excalibur';
import { Global } from './global';
import { pumpkinAmin } from '../resources';

export class Pumpkin extends ex.Actor {

    constructor(xPosition: number, yPosition: number) {
        super({
            x: xPosition,
            y: yPosition,
            width: Global.globalConfig.sprite_size,
            height: Global.globalConfig.sprite_size,
            collider: ex.Shape.Box(
                Global.globalConfig.sprite_size,
                Global.globalConfig.sprite_size,
                ex.Vector.Half,
                ex.vec(0, -1),
            ),
            collisionType: ex.CollisionType.Fixed,
            vel: ex.vec(0, 0),
        });
    }

    onInitialize() {
        const anim = ex.Animation.fromSpriteSheet(pumpkinAmin, [0, 1, 2, 3], 150);

        this.graphics.add('talk', anim);
        this.graphics.use('talk');
    }
}
