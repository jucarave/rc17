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
        this.addInstance(player);

        this.createCamera();

        this.initScene();
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