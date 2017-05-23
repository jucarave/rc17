import Renderer from '../engine/Renderer';
import Instance from '../Instance';
import Camera from '../engine/Camera';
import CharacterFactory from '../factories/CharacterFactory';
import DungeonFactory from '../factories/DungeonFactory';
import { DegToRad } from '../math/Utils';
import Scene from './Scene';

interface InstancesMap {
    [index: string]: Array<Instance>
}

class DungeonScene extends Scene {
    private instances           : InstancesMap;
    
    constructor(renderer: Renderer) {
        super(renderer);

        this.instances = {};

        this.createDungeonTest();
    }

    private createDungeonTest(): void {
        let dungeon = DungeonFactory.createDungeon(this, this.renderer);
        this.addInstance(dungeon);

        let player = CharacterFactory.createPlayer(this, this.renderer);
        this.addInstance(player);

        this.createCamera();

        this.initScene();
    }

    private createCamera(): void {
        let camera = Camera.createPerspective(DegToRad(90), this.renderer.width/this.renderer.height, 0.1, 100.0);
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