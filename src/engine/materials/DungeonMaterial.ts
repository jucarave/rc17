import Material from './Material';
import Renderer from '../Renderer';
import Texture from '../Texture';
import Shader from '../shaders/Shader';

class DungeonMaterial extends Material {
    private texture         : Texture;
    private lightTexture    : WebGLTexture;

    constructor(renderer: Renderer, texture: Texture, lightTexture: WebGLTexture) {
        super(renderer, 'DUNGEON');

        this.texture = texture;
        this.lightTexture = lightTexture;
    }

    public render(): void {
        let gl = this.renderer.GL,
            shader = Shader.lastProgram;

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture.texture);
        gl.uniform1i(shader.uniforms["uTexture"], 0);

        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.lightTexture);
        gl.uniform1i(shader.uniforms["uLightTexture"], 1);
    }

    public get isReady(): boolean {
        return this.texture.isReady;
    }
}

export default DungeonMaterial;