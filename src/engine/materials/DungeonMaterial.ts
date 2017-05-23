import Material from './Material';
import Renderer from '../Renderer';
import Texture from '../Texture';
import Shader from '../shaders/Shader';

class DungeonMaterial extends Material {
    private texture         : Texture;

    constructor(renderer: Renderer, texture: Texture) {
        super(renderer, 'DUNGEON');

        this.texture = texture;
    }

    public render(): void {
        let gl = this.renderer.GL,
            shader = Shader.lastProgram;

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture.texture);
        gl.uniform1i(shader.uniforms["uTexture"], 0);
    }

    public get isReady(): boolean {
        return this.texture.isReady;
    }
}

export default DungeonMaterial;