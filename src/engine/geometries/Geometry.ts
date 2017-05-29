import { VERTICE_SIZE, TEXT_COORD_SIZE, GL_STATIC_DRAW } from '../Constants';
import Renderer from '../Renderer';
import Shader from '../shaders/Shader';

interface CustomBuffer {
    data: Array<number>;
    buffer: WebGLBuffer;
    attribute: string;
    dataSize: number;
    usage: number;
    needsUpdate: boolean;
}

class Geometry {
    private vertices           : Array<number>;
    private textCoords         : Array<number>;
    private triangles          : Array<number>;
    private vertexBuffer       : WebGLBuffer;
    private textCoordBuffer    : WebGLBuffer;
    private indexBuffer        : WebGLBuffer;
    private indexLength        : number;
    private customBuffers      : Array<CustomBuffer>;

    protected renderer           : Renderer;

    constructor() {
        this.vertices = [];
        this.textCoords = [];
        this.triangles = [];
        this.customBuffers = [];
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

    public createCustomBuffer(attribute: string, dataSize: number, usage: number = GL_STATIC_DRAW): CustomBuffer {
        let buffer: CustomBuffer = {
            attribute,
            buffer: null,
            data: [],
            dataSize,
            usage,
            needsUpdate: false
        };

        this.customBuffers.push(buffer);

        return buffer;
    }

    public getCustomBuffer(attribute: string): CustomBuffer {
        for (let i=0,buffer;buffer=this.customBuffers[i];i++) {
            if (buffer.attribute == attribute) {
                return buffer;
            }
        }

        return null;
    }

    public addCustomBufferData(buffer: CustomBuffer, data: Array<number>) {
        if (data.length != buffer.dataSize) { throw new Error("Data is not the same size of buffer data size."); }

        buffer.data = buffer.data.concat(data);
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

        for (let i=0,buffer;buffer=this.customBuffers[i];i++) {
            buffer.buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer.buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(buffer.data), buffer.usage);
        }

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

        for (let i=0,buffer;buffer=this.customBuffers[i];i++) {
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer.buffer);
            if (buffer.needsUpdate) {
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(buffer.data), buffer.usage);
                buffer.needsUpdate = false;
            }

            gl.vertexAttribPointer(shader.attributes[buffer.attribute], buffer.dataSize, gl.FLOAT, false, 0, 0);
        }

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        gl.drawElements(gl.TRIANGLES, this.indexLength, gl.UNSIGNED_SHORT, 0);
    }

    public get verticesCount(): number {
        return this.vertices.length / 3;
    }
}

export default Geometry;