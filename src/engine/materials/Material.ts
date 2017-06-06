import Renderer from '../Renderer';
import { ShadersNames } from '../shaders/ShaderStructure';

abstract class Material {
    protected renderer                : Renderer;    
    
    public readonly shaderName        : ShadersNames;
    public readonly isOpaque            : boolean;

    constructor(renderer: Renderer, shaderName: ShadersNames, opaque: boolean) {
        this.renderer = renderer;
        this.shaderName = shaderName;
        this.isOpaque = opaque;
    }

    public abstract render(): void;
    public abstract get isReady(): boolean;
}

export default Material;