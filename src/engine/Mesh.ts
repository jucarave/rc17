import Geometry from './geometries/Geometry';
import Matrix4 from '../math/Matrix4';
import Renderer from './Renderer';
import Camera from './Camera';
import Material from './materials/Material';
import { Vector3, vec3 } from '../math/Vector3';

class Mesh {
    private geometry            : Geometry;
    private material            : Material;
    private position            : Vector3;
    private rotation            : Vector3;
    private transform           : Matrix4;
    private needsUpdate         : boolean;

    constructor(geometry: Geometry, material: Material, position?: Vector3) {
        this.geometry = geometry;
        this.material = material;
        this.position = (position)? position : vec3(0.0);
        this.rotation = vec3(0.0);
        this.transform = Matrix4.createIdentity();
        this.needsUpdate = true;
    }

    public setPosition(x: number, y: number, z: number): Mesh {
        this.position.set(x, y, z);

        this.needsUpdate = true;

        return this;
    }

    public setRotation(x: number, y: number, z: number): Mesh {
        this.rotation.set(x, y, z);

        this.needsUpdate = true;

        return this;
    }

    public getTransformation(): Matrix4 {
        if (!this.needsUpdate) {
            return this.transform;
        }

        Matrix4.setIdentity(this.transform);
        
        Matrix4.multiply(this.transform, Matrix4.createXRotation(this.rotation.x));
        Matrix4.multiply(this.transform, Matrix4.createYRotation(this.rotation.y));
        Matrix4.multiply(this.transform, Matrix4.createZRotation(this.rotation.z));

        Matrix4.translate(this.transform, this.position.x, this.position.y, this.position.z);

        this.needsUpdate = false;

        return this.transform;
    }

    public render(renderer: Renderer, camera: Camera): void {
        if (!this.material.isReady) { return; }
        
        let gl = renderer.GL,
            shader = renderer.shader,
            
            transform = Matrix4.createIdentity();

        transform = Matrix4.multiply(transform, this.getTransformation());
        transform = Matrix4.multiply(transform, camera.getTransformation());

        gl.uniformMatrix4fv(shader.uniforms["uProjection"], false, camera.projection);
        gl.uniformMatrix4fv(shader.uniforms["uPosition"], false, transform);

        this.material.render();

        this.geometry.render();
    }
}

export default Mesh;