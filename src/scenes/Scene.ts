import Renderer from '../engine/Renderer';
import Camera from '../engine/Camera';
import GameObject from '../entities/GameObject';

abstract class Scene {
    protected renderer                : Renderer;
    protected camera                  : Camera
    protected gameObjects             : Array<GameObject>;

    constructor(renderer: Renderer) {
        this.renderer = renderer;
        this.gameObjects = [];
    }

    public render(): void {
        for (let i=0,go;go=this.gameObjects[i];i++) {
            go.update(this.camera);
        }

        for (let i=0,go;go=this.gameObjects[i];i++) {
            go.render(this.renderer, this.camera);
        }
    }

    public getCamera(): Camera {
        return this.camera;
    }

    public addGameObject(gameObject: GameObject): Scene {
        this.gameObjects.push(gameObject);

        return this;
    }
}

export default Scene;