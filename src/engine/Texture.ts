import Renderer from './Renderer';

class Texture {
    private src         : string;
    private image       : HTMLImageElement;
    private renderer    : Renderer;
    private ready       : boolean;
    
    public readonly texture     : WebGLTexture;

    constructor(src: string, renderer: Renderer, callback?: Function) {
        this.src = src;
        this.renderer = renderer;
        this.texture = renderer.GL.createTexture();
        this.ready = false;

        this.image = new Image();
        this.image.src = src;
        this.image.onload = () => {
            this.handleImageReady();

            if (callback) {
                callback(this);
            }
        };
    }

    private handleImageReady(): void {
        let gl = this.renderer.GL;

        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);

        this.ready = true;
    }

    public get isReady() { return this.ready; }
    public get width() { return this.image.width; }
    public get height() { return this.image.height; }
}

export default Texture;