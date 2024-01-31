export enum Protocols {
    CLOSEST_ENEMIES = 'closest-enemies',
    FURTHEST_ENEMIES = 'furthest-enemies',
    ASSIST_ALLIES ='assist-allies',
    AVOID_CROSSFIRE = 'avoid-crossfire',
    PRIORITIZE_MECH = 'prioritize-mech',
    AVOID_MECH = 'avoid-mech',
}

export enum EnemyTypes {
    SOLDIER = 'soldier',
    MECH = 'mech',
}

export interface Scan {
    coordinates: {
        x: number;
        y: number;
    };
    enemies: {
        type: EnemyTypes;
        number: number;
    };
    allies?: number;
}

export interface PostScanRequest {
    protocols: Protocols[];
    scan: Scan[];
}

export interface ScanResponse{
    x: number;
    y: number;
}