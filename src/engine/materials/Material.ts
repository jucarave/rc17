import Renderer from '../Renderer';
import { ShadersNames } from '../shaders/ShaderStructure';

abstract class Material {
    protected renderer                : Renderer;    
    
    public readonly shaderName        : ShadersNames;

    constructor(renderer: Renderer, shaderName: ShadersNames) {
        this.renderer = renderer;
        this.shaderName = shaderName;
    }

    public abstract render(): void;
    public abstract get isReady(): boolean;
}

export default Material;