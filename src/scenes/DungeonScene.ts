declare let astar: any;

import Renderer from '../engine/Renderer';
import Camera from '../engine/Camera';
import { CAMERA_ORTHO_WIDTH, CAMERA_ORTHO_HEIGHT, CAMERA_ORTHO_ZFAR, CAMERA_ORTHO_ZNEAR} from '../engine/Constants';
import CharacterFactory from '../factories/CharacterFactory';
import { DungeonFactory, Dungeon } from '../factories/DungeonFactory';
//import { DegToRad } from '../math/Utils';
import Instance from '../Instance';
import Scene from './Scene';

interface InstancesMap {
    [index: string]: Array<Instance>
}

class DungeonScene extends Scene {
    private instances           : InstancesMap;
    private dungeon             : Dungeon;
    private player              : Instance;
    
    constructor(renderer: Renderer) {
        super(renderer);

        this.instances = {};

        this.createDungeonTest();
    }

    private createDungeonTest(): void {
        this.dungeon = DungeonFactory.createDungeon(this, this.renderer);
        this.addInstance(this.dungeon.instance);

        let player = CharacterFactory.createPlayer(this, this.renderer);
        player.setPosition(3, 0, 3);
        this.player = player;
        this.addInstance(player);

        this.createCamera();

        this.initScene();

        this.castLight(player, 8);
    }

    private createCamera(): void {
        //let camera = Camera.createPerspective(DegToRad(90), this.renderer.width/this.renderer.height, 0.1, 100.0);
        let camera = Camera.createOrthographic(CAMERA_ORTHO_WIDTH, CAMERA_ORTHO_HEIGHT, CAMERA_ORTHO_ZNEAR, CAMERA_ORTHO_ZFAR);
        camera.setPosition(0, 15, 30);
        camera.setTarget(0, 0, 0);

        this.camera = camera;
    }

    private initScene(): void {
        for (let j in this.instances) {
            let instances = this.instances[j];
            
            for (let i=0,ins;ins=instances[i];i++) {
                ins.awake();
            }
        }
    }

    private castLightRay(x1: number, z1: number, x2: number, z2: number, distance: number): void {
        let dx = Math.abs(x2 - x1),
            dz = Math.abs(z2 - z1),
            
            sx = (x2 > x1)? 1 : -1,
            sz = (z2 > z1)? 1 : -1,
            
            err = dx-dz,
            d = 0;

        let x0=x1, z0=z1;
        let dis = (x: number, z: number) => {
            return Math.sqrt(x*x + z*z);
        };

        while (true) {
            this.dungeon.lightMap.lightTile(x1, z1);

            d += dis(x1-x0,z1-z0);
            if (d >= distance || this.isSolid(x1, z1)) {
                return;
            }

            let e2 = err * 2;
            if (e2 > -dx) {
                err -= dz;
                x1 += sx;
            }

            if (e2 < dx) {
                err += dx;
                z1 += sz;
            }
        }
    }

    public addInstance(instance: Instance): void {
        let shaderName = instance.getShaderName();

        if (this.instances[shaderName]) {
            this.instances[shaderName].push(instance);
        } else {
            this.instances[shaderName] = [ instance ];
        }
    }

    public isSolid(x: number, z: number): boolean {
        let map = this.dungeon.map;

        return (map[z] && map[z][x] && map[z][x].solid);
    }

    public getPath(xstart: number, zstart: number, xend: number, zend: number): Array<number> {
        let map = this.dungeon.map;
        if (map[zstart] == undefined || map[zend] == undefined || map[zend][xend] == undefined) { return []; }

        let ret: Array<number> = [],
            graph = this.dungeon.graph, 
            start = graph.grid[xstart][zstart],
            end = graph.grid[xend][zend],
            result = astar.search(graph, start, end);
        
        for (let i=0,node;node=result[i];i++) {
            ret.push(node.x, node.y);
        }

        return ret;
    }

    public castLight(instance: Instance, distance: number): void {
        let d = distance,
            d_2 = distance / 2,
            x = instance.getPosition().x,
            z = instance.getPosition().z;

        for (let i=0;i<=distance*2;i++) {
            this.castLightRay(x, z, x - d, z - d + i, d_2);
            this.castLightRay(x, z, x + d, z - d + i, d_2);
            this.castLightRay(x, z, x - d + i, z - d, d_2);
            this.castLightRay(x, z, x - d + i, z + d, d_2);
        }

        this.dungeon.lightMap.update();
    }

    public render(): void {
        for (let j in this.instances) {
            let instances = this.instances[j];

            for (let i=0,ins;ins=instances[i];i++) {
                ins.update();
            }

            for (let i=0,ins;ins=instances[i];i++) {
                ins.render(this.renderer, this.camera);
            }
        }
    }
}

export default DungeonScene;