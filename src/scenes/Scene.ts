import Renderer from '../engine/Renderer';

abstract class Scene {
    protected renderer                : Renderer;

    constructor(renderer: Renderer) {
        this.renderer = renderer;
    }

    public abstract render(): void;
}

export default Scene;