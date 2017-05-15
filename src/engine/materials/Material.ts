import Renderer from '../Renderer';

abstract class Material {
    protected renderer: Renderer;

    constructor(renderer: Renderer) {
        this.renderer = renderer;
    }

    public abstract render(): void;
    public abstract get isReady(): boolean;
}

export default Material;