import Renderer from '../engine/Renderer';
import Camera from '../engine/Camera';

abstract class Scene {
    protected renderer                : Renderer;
    protected camera                  : Camera

    constructor(renderer: Renderer) {
        this.renderer = renderer;
    }

    public abstract render(): void;

    public getCamera(): Camera {
        return this.camera;
    }
}

export default Scene;