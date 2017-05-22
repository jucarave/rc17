import { VERTICE_SIZE, TEXT_COORD_SIZE } from '../Constants';
import Renderer from '../Renderer';
import Shader from '../shaders/Shader';

class Geometry {
    private vertices           : Array<number>;
    private textCoords         : Array<number>;
    private triangles          : Array<number>;
    private vertexBuffer       : WebGLBuffer;
    private textCoordBuffer    : WebGLBuffer;
    private indexBuffer        : WebGLBuffer;
    private indexLength        : number;

    protected renderer           : Renderer;

    constructor() {
        this.vertices = [];
        this.textCoords = [];
        this.triangles = [];
    }

    public addVertice(x: number, y: number, z: number): void {
        this.vertices.push(x, y, z);
    }

    public addTextCoord(tx: number, ty: number): void {
        this.textCoords.push(tx, ty);
    }

    public addTriangle(vert1: number, vert2: number, vert3: number): void {
        if (this.vertices[vert1 * VERTICE_SIZE] === undefined) { throw new Error("Vertice [" + vert1 + "] not found"); }
        if (this.vertices[vert2 * VERTICE_SIZE] === undefined) { throw new Error("Vertice [" + vert2 + "] not found"); }
        if (this.vertices[vert3 * VERTICE_SIZE] === undefined) { throw new Error("Vertice [" + vert3 + "] not found"); }

        this.triangles.push(vert1, vert2, vert3);
    }

    public build(renderer: Renderer): void {
        this.renderer = renderer;
        let gl = renderer.GL;

        this.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

        this.textCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.textCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.textCoords), gl.STATIC_DRAW);

        this.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.triangles), gl.STATIC_DRAW);

        this.indexLength = this.triangles.length;
        this.vertices = null;
        this.triangles = null;
        this.textCoords = null;
    }

    public render(): void {
        let gl = this.renderer.GL,
            shader = Shader.lastProgram;

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.vertexAttribPointer(shader.attributes["aVertexPosition"], VERTICE_SIZE, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.textCoordBuffer);
        gl.vertexAttribPointer(shader.attributes["aTextureCoords"], TEXT_COORD_SIZE, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        gl.drawElements(gl.TRIANGLES, this.indexLength, gl.UNSIGNED_SHORT, 0);
    }
}

export default Geometry;