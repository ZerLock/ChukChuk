import * as ex from "excalibur";
import { getSpritesToDisplay, Views } from "../utils/map";
import { Global } from "../class/global";
import { Player } from "../class/player";
import map from '../maps/level1-3.json';
import _dico from '../../resources/script/dictionnaire.json';
import type { Sprites } from '../../models';
import { blocksSpriteSheet } from "../resources";
import { Pumpkin } from "../class/pumpkin";

const dico = _dico as Sprites;

export class SideScene extends ex.Scene {
    private player: Player;
    private pumpkin: Pumpkin;

    constructor(halfDrawWidth: number, halfDrawHeigh: number) {
        super();
        this.player = new Player(10, 10);
        this.pumpkin = new Pumpkin(
            Global.globalConfig.pumpkin_pos.x * Global.globalConfig.sprite_size,
            Global.globalConfig.pumpkin_pos.y * Global.globalConfig.sprite_size + 10,
        );
        this.add(this.pumpkin);
        this.add(this.player);
    }

    public onActivate(_context: ex.SceneActivationContext<unknown>): void {
        // Set physics
        ex.Physics.useArcadePhysics();
        ex.Physics.acc = ex.vec(0, Global.globalConfig.gravity);
        this.player.vel.setTo(0, 0);

        // Load map
        this.loadMap();

        // Load player
        const player_pos = Global.globalConfig.player_pos;
        console.log(player_pos);
        player_pos.x *= Global.globalConfig.sprite_size;
        player_pos.y = (14 - player_pos.y) * Global.globalConfig.sprite_size;
        console.log(player_pos);
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
        const sprite_size = Global.globalConfig.sprite_size;

        // Load pumpkin
        if (!Global.globalConfig.hasPumpkin) {
            console.log('yo');
            this.pumpkin = new Pumpkin(
                Global.globalConfig.pumpkin_pos.x * sprite_size,
                Global.globalConfig.pumpkin_pos.y * sprite_size + 10,
            );
            this.add(this.pumpkin);
        }

        // Get sprites to display
        const sprites = getSpritesToDisplay(map, Views.Side);

        for (const block of sprites.playerLayer) {
            const ref = dico[block.id]; // Get block reference by ID

            const actorPayload: any = {
                pos: ex.vec(block.x * sprite_size, block.y * sprite_size),
                width: sprite_size,
                height: sprite_size,
            }
            if (ref.collision) {
                actorPayload.collisionType = ex.CollisionType.Fixed;
            }

            // Create new block actor
            const actor = new ex.Actor(actorPayload);

            // Get sprite from spritesheet
            const sprite = blocksSpriteSheet.sprites[ref.y * 32 + ref.x];
            sprite.height = Global.globalConfig.sprite_size; // Set size for responsive
            sprite.width = Global.globalConfig.sprite_size; // Set size for responsive

            actor.graphics.use(sprite); // Add sprite on the block actor

                  // kill player on aggressive sprite
            if (ref.agressive) {
                actor.on("precollision", (evt) => {
                    if (evt.other === this.player) {
                        this.player.kill();
                    }
                });
            }

            this.add(actor); // Add the actor to the scene
        }
    }
}
