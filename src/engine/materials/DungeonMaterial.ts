import Material from './Material';
import Renderer from '../Renderer';
import Texture from '../Texture';
import Shader from '../shaders/Shader';

class DungeonMaterial extends Material {
    private texture         : Texture;
    private uvs             : Array<number>;
    private currentAnim     : string;
    private repeat          : Array<number>;

    constructor(renderer: Renderer, texture: Texture, uvs?: Array<number>) {
        super(renderer, 'DUNGEON');

        this.texture = texture;
        this.uvs = (uvs)? uvs : [0, 0, 1, 1];
        this.repeat = [1, 1];
        this.currentAnim = null;
    }

    public render(): void {
        let gl = this.renderer.GL,
            shader = Shader.lastProgram;

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture.texture);
        gl.uniform1i(shader.uniforms["uTexture"], 0);

        gl.uniform4fv(shader.uniforms["uSpriteRect"], this.uvs);

        gl.uniform2fv(shader.uniforms["uRepeatTexture"], this.repeat);
    }

    public repeatTexture(hr: number, vr: number): void {
        this.repeat = [hr, vr];
    }

    public get isReady(): boolean {
        return this.texture.isReady;
    }
}

export default DungeonMaterial;