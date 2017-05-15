import Renderer from '../engine/Renderer';
import Instance from '../Instance';
import Camera from '../engine/Camera';
import CharacterFactory from '../factories/CharacterFactory';
import { DegToRad } from '../math/Utils';
import Scene from './Scene';

class DungeonScene extends Scene {
    private instances           : Array<Instance>;
    private camera              : Camera

    constructor(renderer: Renderer) {
        super(renderer);

        this.instances = [];

        this.createDungeonTest();
    }

    private createDungeonTest(): void {
        let player = CharacterFactory.createPlayer(this.renderer);

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
        for (let i=0,ins;ins=this.instances[i];i++) {
            ins.awake();
        }
    }

    public addInstance(instance: Instance): void {
        this.instances.push(instance);
    }

    public render(): void {
        for (let i=0,ins;ins=this.instances[i];i++) {
            ins.update();
        }

        for (let i=0,ins;ins=this.instances[i];i++) {
            ins.render(this.renderer, this.camera);
        }
    }
}

export default DungeonScene;