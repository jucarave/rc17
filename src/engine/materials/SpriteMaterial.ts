import Material from './Material';
import Renderer from '../Renderer';
import Texture from '../Texture';
import Animation from '../Animation';
import Shader from '../shaders/Shader';

interface AnimationMap {
    [index: string]: Animation;
}

class SpriteMaterial extends Material {
    private texture         : Texture;
    private animations      : AnimationMap;
    private currentAnim     : string;

    constructor(renderer: Renderer, texture: Texture) {
        super(renderer, 'BASIC');

        this.texture = texture;
        this.animations = {};
        this.currentAnim = null;
    }

    public render(): void {
        let gl = this.renderer.GL,
            shader = Shader.lastProgram;

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture.texture);
        gl.uniform1i(shader.uniforms["uTexture"], 0);

        let animation = this.animations[this.currentAnim];
        animation.update();

        gl.uniform4fv(shader.uniforms["uSpriteRect"], animation.frame);
    }

    public addAnimation(animation: Animation): void {
        this.animations[animation.name] = animation.clone();

        if (!this.currentAnim) { 
            this.currentAnim = animation.name;
        }
    }

    public playAnimation(name: string): void {
        if (!this.animations[name]) { throw new Error("Cannot find animation [" + name + "]"); }

        this.currentAnim = name;
    }

    public get isReady(): boolean {
        return this.texture.isReady;
    }

    public get animation(): Animation {
        return this.animations[this.currentAnim];
    }
}

export default SpriteMaterial;