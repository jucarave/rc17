import Geometry from './engine/geometries/Geometry';
import Renderer from './engine/Renderer';
import Camera from './engine/Camera';
import { GRID_SIZE } from './engine/Constants';
import Material from './engine/materials/Material';
import Shader from './engine/shaders/Shader';
import Matrix4 from './math/Matrix4';
import { Vector3, vec3 } from './math/Vector3';
import Component from './components/Component';
import Scene from './scenes/Scene';

class Instance {
    private scene               : Scene;
    private geometry            : Geometry;
    private material            : Material;
    private position            : Vector3;
    private rotation            : Vector3;
    private transform           : Matrix4;
    private components          : Array<Component>;
    private needsUpdate         : boolean;

    public isStatic             : boolean;
    public isBillboard          : boolean;
    public distanceToCamera     : number;

    constructor(scene: Scene, position?: Vector3, geometry?: Geometry, material?: Material) {
        this.scene = scene;
        this.geometry = (geometry)? geometry : null;
        this.material = (material)? material : null;
        this.position = (position)? position : vec3(0.0);
        this.rotation = vec3(0.0);
        this.transform = Matrix4.createIdentity();
        this.components = [];
        this.needsUpdate = true;
        this.isStatic = false;
        this.isBillboard = false;
    }

    public setPosition(x: number, y: number, z: number, relative: boolean = false): Instance {
        if (relative) {
            this.position.add(x, y, z);
        } else {
            this.position.set(x, y, z);
        }

        this.needsUpdate = true;

        return this;
    }

    public setRotation(x: number, y: number, z: number): Instance {
        this.rotation.set(x, y, z);

        this.needsUpdate = true;

        return this;
    }

    public getMaterial(): Material {
        return this.material;
    }

    public getTransformation(camera: Camera): Matrix4 {
        if (this.isBillboard) {
            let angle = camera.getAngle();
            if (!this.rotation.equals(angle)) {
                this.setRotation(angle.x, angle.y, angle.z);
            }
        }

        if (!this.needsUpdate) {
            return this.transform;
        }

        Matrix4.setIdentity(this.transform);
        
        Matrix4.multiply(this.transform, Matrix4.createXRotation(this.rotation.x));
        Matrix4.multiply(this.transform, Matrix4.createZRotation(this.rotation.z));
        Matrix4.multiply(this.transform, Matrix4.createYRotation(this.rotation.y));

        let x: number, y: number, z: number;
        if (this.isStatic) {
            x = this.position.x;
            y = this.position.y;
            z = this.position.z;
        } else {
            let gs = GRID_SIZE;

            x = this.position.x * gs + gs / 2;
            y = this.position.y * gs + gs / 2;
            z = this.position.z * gs + gs / 2;
        }
        
        Matrix4.translate(this.transform, x, y, z);

        this.needsUpdate = false;

        return this.transform;
    }

    public addComponent(component: Component): Instance {
        this.components.push(component);

        return this;
    }

    public getComponent<T>(componentName: string): T {
        for (let i=0,component;component=this.components[i];i++) {
            if (component.name == componentName) {
                return <T>(<any>component);
            }
        }

        return null;
    }

    public getPosition(): Vector3 {
        return this.position;
    }

    public getScene(): Scene {
        return this.scene;
    }

    public getShaderName(): string {
        return this.material.shaderName;
    }

    public awake(): void {
        for (let i=0,component;component=this.components[i];i++) {
            component.start();
        }
    }

    public update(): void {
        for (let i=0,component;component=this.components[i];i++) {
            component.update();
        }
    }

    public destroy(): void {
        for (let i=0,component;component=this.components[i];i++) {
            component.destroy();
        }
    }

    public render(renderer: Renderer, camera: Camera): void {
        if (!this.geometry || !this.material) { return; }
        if (!this.material.isReady) { return; }

        renderer.setShader(this.material.shaderName);
        
        let gl = renderer.GL,
            shader = Shader.lastProgram,
            
            transform = Matrix4.createIdentity();

        transform = Matrix4.multiply(transform, this.getTransformation(camera));
        transform = Matrix4.multiply(transform, camera.getTransformation());

        gl.uniformMatrix4fv(shader.uniforms["uProjection"], false, camera.projection);
        gl.uniformMatrix4fv(shader.uniforms["uPosition"], false, transform);

        this.material.render();

        this.geometry.render();
    }
}

export default Instance;