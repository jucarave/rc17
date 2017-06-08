import Renderer from './Renderer';
import { col } from '../math/Utils';

class LightMap {
    private renderer                : Renderer;
    private width                   : number;
    private height                  : number;
    private lightMap                : Array<Array<number>>;
    private pixelsData              : ArrayBuffer;
    private pix8bit                 : Uint8Array;
    private pix32bit                : Uint32Array;

    //private static light            : number = col(255, 255, 255, 255);
    private static shadow           : number = col(122, 122, 122, 255);

    public readonly texture         : WebGLTexture;

    constructor(width: number, height: number, renderer: Renderer) {
        this.renderer = renderer;
        this.width = width;
        this.height = height;
        this.pixelsData = new ArrayBuffer(width * height * 4);
        this.pix8bit = new Uint8Array(this.pixelsData);
        this.pix32bit = new Uint32Array(this.pixelsData);
        this.texture = renderer.GL.createTexture();
        this.lightMap = new Array(this.height);
        
        for (let z=0;z<height;z++) {
            this.lightMap[z] = new Array(width);

            for (let x=0;x<width;x++) {
                this.lightMap[z][x] = 0;
            }
        }

        this.updateTexture();
    }

    private plot(x: number, z: number, color: number): void {
        this.pix32bit[z * this.width + x] = color;
    }

    private updateTexture(): void {
        let gl = this.renderer.GL;

        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 16, 16, 0, gl.RGBA, gl.UNSIGNED_BYTE, this.pix8bit);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    public update(): void {
        let needsUpdate = false;

        for (let z=0;z<this.height;z++) {
            for (let x=0;x<this.width;x++) {
                let tile = this.lightMap[z][x];

                if (tile == 2) {
                    this.plot(x, z, LightMap.shadow);
                    this.lightMap[z][x] = 1;
                    needsUpdate = true;
                } else if (tile > 2) {
                    let str = (((tile - 2) / 10 * 122) << 0) + 123,
                        color = col(str, str, str, 255);

                    this.plot(x, z, color);
                    this.lightMap[z][x] = 2;
                    needsUpdate = true;
                }
            }
        }

        if (needsUpdate) {
            this.updateTexture();
        }
    }

    public lightTile(x: number, z: number, strength: number) {
        if (strength < this.lightMap[z][x] - 2) { return; }
        this.lightMap[z][x] = strength + 2;
    }

    public getVisible(x: number, z: number): number {
        return this.lightMap[z][x];
    }
}

export default LightMap;