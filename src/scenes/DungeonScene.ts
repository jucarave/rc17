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

        this.castLight(player, 14);
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
        let map = this.dungeon.map,
            lm = this.dungeon.lightMap,
            x = x2 - x1,
            z = z1 - z2,
            ang = Math.atan2(z, x),
            jx = Math.cos(ang) * 0.5,
            jz = -Math.sin(ang) * 0.5,
            rx = x1 + 0.49,
            rz = z1 + 0.49,
            cx: number, cz: number,
            search: boolean = true,
            d = 0,
            md = distance / 2;

        while (search) {
            cx = Math.round(rx);
            cz = Math.round(rz);

            if (!map[cz]) { search = false; continue; }
            if (!map[cz][cx]) { search = false; continue; }

            lm.lightTile(cx, cz);
            if (this.isSolid(cx, cz)) {
                search = false;
            }

            if (d++ >= md) {
                search = false;
            }

            rx += jx;
            rz += jz;
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
        let d = distance / 2,
            x = instance.getPosition().x,
            z = instance.getPosition().z;

        for (let i=0;i<=distance;i++) {
            this.castLightRay(x, z, x - d, z - d + i, distance);
            this.castLightRay(x, z, x + d, z - d + i, distance);
            this.castLightRay(x, z, x - d + i, z - d, distance);
            this.castLightRay(x, z, x - d + i, z + d, distance);
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