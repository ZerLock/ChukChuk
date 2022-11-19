import * as ex from "excalibur";
import { getSpritesToDisplay, Views } from "../utils/map";
import { Global } from "../class/global";
import { Player } from "../class/player";
import map from '../maps/level1-3.json';
import _dico from '../../resources/script/dictionnaire.json';
import type { Sprites } from '../../models';
import { blocksSpriteSheet } from "../resources";

const dico = _dico as Sprites;

export class SideScene extends ex.Scene {
    private player: Player;

    constructor(halfDrawWidth: number, halfDrawHeigh: number) {
        super();
        this.player = new Player(10, 10);
        this.add(this.player);
    }

    public onActivate(_context: ex.SceneActivationContext<unknown>): void {
        ex.Physics.useArcadePhysics();
        ex.Physics.acc = ex.vec(0, Global.globalConfig.gravity);
        this.player.vel.setTo(0, 0);

        this.loadMap();

        const player_pos = Global.globalConfig.player_pos;
        player_pos.x *= Global.globalConfig.sprite_size;
        player_pos.y *= Global.globalConfig.sprite_size;
        if (!this.player.isKilled()) {
            this.player.kill();
        }
        this.player = new Player(player_pos.x, player_pos.y);
        this.add(this.player);
    }

    public onDeactivate(_context: ex.SceneActivationContext<undefined>): void {
        const sprite_size = Global.globalConfig.sprite_size;
        Global.globalConfig.player_pos.x = Math.floor(this.player.pos.x / sprite_size);
        Global.globalConfig.player_pos.y = 14 - Math.floor(this.player.pos.y / sprite_size);
        this.clear();
    }

    private loadMap() {
        // Get sprites to display
        const sprites = getSpritesToDisplay(map, Views.Side);
        const sprite_size = Global.globalConfig.sprite_size;

        for (const block of sprites.playerLayer) {
            const ref = dico[block.id]; // Get block reference by ID

            // Create new block actor
            const actor = new ex.Actor({
                pos: ex.vec(block.x * sprite_size, block.y * sprite_size),
                width: sprite_size,
                height: sprite_size,
                collisionType: ref.collision
                    ? ex.CollisionType.Fixed
                    : ex.CollisionType.Active,
            });

            // Get sprite from spritesheet
            const sprite = blocksSpriteSheet.sprites[ref.y * 32 + ref.x];
            sprite.height = Global.globalConfig.sprite_size; // Set size for responsive
            sprite.width = Global.globalConfig.sprite_size; // Set size for responsive

            actor.graphics.use(sprite); // Add sprite on the block actor

            this.add(actor); // Add the actor to the scene
        }
    }
}
