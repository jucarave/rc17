declare let astar: any;

import Renderer from '../engine/Renderer';
import Camera from '../engine/Camera';
import { CAMERA_ORTHO_WIDTH, CAMERA_ORTHO_HEIGHT, CAMERA_ORTHO_ZFAR, CAMERA_ORTHO_ZNEAR} from '../engine/Constants';
import CharacterFactory from '../factories/CharacterFactory';
import { DungeonFactory, Dungeon } from '../factories/DungeonFactory';
import { getDistance/*, DegToRad*/ } from '../math/Utils';
import { vec3 } from '../math/Vector3';
import PlayerComponent from '../components/PlayerComponent';
import Instance from '../Instance';
import Scene from './Scene';

interface InstancesMap {
    list: Array<Instance>,
    opaques: Array<Instance>,
    transparent: Array<Instance>
}

class DungeonScene extends Scene {
    private instances           : InstancesMap;
    private dungeon             : Dungeon;
    private player              : Instance;
    
    constructor(renderer: Renderer) {
        super(renderer);

        this.instances = {
            list: [],
            opaques: [],
            transparent: []
        };

        this.createDungeonTest();
    }

    private createDungeonTest(): void {
        this.dungeon = DungeonFactory.createDungeon(this, this.renderer);
        this.addInstance(this.dungeon.instance);

        let player = CharacterFactory.createPlayer(this, this.renderer, vec3(3, 0, 3));
        this.player = player;
        this.addInstance(player);

        this.addInstance(CharacterFactory.createEnemy(this, this.renderer, vec3(7, 0, 4)));

        this.createCamera();

        this.initScene();

        this.castLight(player, PlayerComponent.losDistance);
    }

    private createCamera(): void {
        //let camera = Camera.createPerspective(DegToRad(90), this.renderer.width/this.renderer.height, 0.1, 100.0);
        let camera = Camera.createOrthographic(CAMERA_ORTHO_WIDTH, CAMERA_ORTHO_HEIGHT, CAMERA_ORTHO_ZNEAR, CAMERA_ORTHO_ZFAR);
        camera.setPosition(0, 15, 30);
        camera.setTarget(0, 0, 0);

        this.camera = camera;
    }

    private initScene(): void {
        for (let i=0,ins;ins=this.instances.list[i];i++) {
            ins.awake();
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

        while (true) {
            this.dungeon.lightMap.lightTile(x1, z1, 10-d/distance*10);

            d += getDistance(x1-x0,z1-z0);
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
        let shaderName = instance.getShaderName(),
            opaque = instance.getMaterial().isOpaque,
            list = (opaque)? this.instances.opaques : this.instances.transparent;

        this.instances.list.push(instance);

        for (let i=0,ins;ins=list[i];i++){
            if (ins.getShaderName() == shaderName) {
                list.splice(i, 0, instance);
                return;
            }
        }
        
        if (opaque) {
            this.instances.opaques.push(instance);
        } else {
            this.instances.transparent.push(instance);
        }
    }

    public isSolid(x: number, z: number): boolean {
        let map = this.dungeon.map;

        return (map[z] && map[z][x] && map[z][x].solid);
    }

    public setSolid(x: number, z: number, weight: number): void {
        let graph = this.dungeon.graph;

        graph.grid[x][z].weight = weight; 
    }

    public isVisible(x: number, z: number): boolean {
        let lm = this.dungeon.lightMap;

        return lm.getVisible(x, z) >= 2;
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
        let updated = false;

        for (let i=0,ins;ins=this.instances.list[i];i++) {
            ins.update(this.camera);

            updated = updated || !ins.isUpdated;
        }

        if (updated || !this.camera.isUpdated) {
            this.instances.transparent.sort((a: Instance, b: Instance) => {
                return (b.distanceToCamera < a.distanceToCamera)? -1 : 1;
            });
        }

        for (let i=0,ins;ins=this.instances.opaques[i];i++) {
            ins.render(this.renderer, this.camera);
        }

        for (let i=0,ins;ins=this.instances.transparent[i];i++) {
            ins.render(this.renderer, this.camera);
        }
    }
}

export default DungeonScene;