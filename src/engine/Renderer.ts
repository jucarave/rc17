import Shader from './shaders/Shader';
import BasicShader from './shaders/BasicShader';
import { ShaderMap } from './shaders/ShaderStructure';

class Renderer {
    private canvas      : HTMLCanvasElement;
    private gl          : WebGLRenderingContext;
    private shaders     :  ShaderMap;

    constructor(width: number, height: number, container?: HTMLElement) {
        this.createCanvas(width, height, container);
        this.initGL();
        this.initShaders();
    }

    private createCanvas(width: number, height: number, container?: HTMLElement): void {
        let canvas: HTMLCanvasElement = document.createElement("canvas");

        canvas.width = width;
        canvas.height = height;

        let gl = canvas.getContext("webgl");
        if (!gl) {
            throw new Error("Cannot initialize WebGL context");
        }

        this.canvas = canvas;
        this.gl = gl;

        if (container) {
            container.appendChild(canvas);
        }
    }

    private initGL(): void {
        let gl = this.gl;

        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);
        gl.enable(gl.BLEND);

        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(0, 0, 0, 1);
    }

    private initShaders(): void {
        this.shaders = {};

        this.shaders.BASIC = new Shader(this.gl, BasicShader);

        this.shaders.BASIC.useProgram();
    }

    public clear(): void {
        let gl = this.gl;
        gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
    }

    public get GL(): WebGLRenderingContext {
        return this.gl;
    }

    public get shader(): Shader {
        return this.shaders.BASIC;
    }

    public get width(): number {
        return this.canvas.width;
    }

    public get height(): number {
        return this.canvas.height;
    }
}

export default Renderer;