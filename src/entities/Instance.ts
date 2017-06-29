import Geometry from '../engine/geometries/Geometry';
import Renderer from '../engine/Renderer';
import Camera from '../engine/Camera';
import { GRID_SIZE } from '../engine/Constants';
import Material from '../engine/materials/Material';
import Shader from '../engine/shaders/Shader';
import Matrix4 from '../math/Matrix4';
import { Vector3 } from '../math/Vector3';
import { squaredDist } from '../math/Utils';
import Scene from '../scenes/Scene';
import DungeonScene from '../scenes/DungeonScene';
import GameObject from './GameObject';

class Instance extends GameObject {
    private geometry            : Geometry;
    private material            : Material;
    private transform           : Matrix4;
    private needsUpdate         : boolean;
    private solidPosition       : Vector3;
    private onTurn              : boolean;

    public isStatic             : boolean;
    public isBillboard          : boolean;
    public isLit                : boolean;
    public isGridPosition       : boolean;
    public distanceToCamera     : number;

    constructor(scene: Scene, position?: Vector3, geometry?: Geometry, material?: Material) {
        super(scene, position);

        this.geometry = (geometry)? geometry : null;
        this.material = (material)? material : null;
        this.transform = Matrix4.createIdentity();
        this.needsUpdate = true;
        this.isStatic = false;
        this.isBillboard = false;
        this.isGridPosition = true;
        this.isLit = false;
        this.solidPosition = null;
        this.onTurn = false;
    }

    public setPosition(x: number, y: number, z: number, relative: boolean = false): Instance {
        super.setPosition(x, y, z, relative);

        this.needsUpdate = true;

        return this;
    }

    public setRotation(x: number, y: number, z: number): Instance {
        super.setRotation(x, y, z);

        this.needsUpdate = true;

        return this;
    }

    public setSolid(): void {
        if (this.solidPosition != null) {
            (<DungeonScene>this.scene).setSolid(this.solidPosition.x, this.solidPosition.z, 1);
            this.solidPosition.set(this.position.x, this.position.y, this.position.z);
        } else {
            this.solidPosition = this.position.clone();
        }

        (<DungeonScene>this.scene).setSolid(this.position.x, this.position.z, 0);
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
        if (!this.isGridPosition) {
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

    public getShaderName(): string {
        return this.material.shaderName;
    }

    public startTurn(): void {
        this.onTurn = true;
    }

    public endTurn(): void {
        this.onTurn = false;

        (<DungeonScene>this.scene).passTurn();
    }

    public hasTurn(): boolean {
        return this.onTurn;
    }

    public awake(): void {
        for (let i=0,component;component=this.components[i];i++) {
            component.start();
        }
    }

    public update(camera: Camera): void {
        if (this.onTurn) {
            for (let i=0,component;component=this.components[i];i++) {
                component.update();
            }
        }

        if (this.needsUpdate || !camera.isUpdated) {
            let ip = this.getPosition(),
                cp = camera.getPosition();

            this.distanceToCamera = squaredDist(ip.x - cp.x, ip.z - cp.z);
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
        if (!this.isLit && !(<DungeonScene>this.scene).isVisible(this.position.x << 0, this.position.z << 0)) { return; }

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

    public get isUpdated(): boolean {
        return !this.needsUpdate;
    }
}

export default Instance;