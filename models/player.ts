export interface Position {
    x: number;
    y: number;
    z: number;
}

export type Anim = {
    run: 'RUN',
    idle: 'IDLE',
    jump: 'JUMP',
};
