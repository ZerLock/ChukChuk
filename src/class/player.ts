import * as ex from "excalibur";

export class Player extends ex.Actor {
    constructor() {
        super({
            x: 10,
            y: 10,
            width: 20,
            height: 20,
            color: ex.Color.Red,
            collisionType: ex.CollisionType.Active,
        });
    }
}
