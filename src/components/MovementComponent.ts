import Camera from '../engine/Camera';
import { GRID_SIZE } from '../engine/Constants';
import { Vector4, vec4 } from '../math/Vector4';
import { Vector3, vec3 } from '../math/Vector3';
import { DegToRad } from '../math/Utils';
import Instance from '../Instance';
import Component from './Component';
import DungeonScene from '../scenes/DungeonScene';

class MovementComponent extends Component {
    private moving              : boolean;
    private moveVector          : Vector4;
    private speed               : number;
    private camera              : Camera;
    private cameraAngle         : Vector3;

    public static className     : string = "movementComponent";

    constructor(instance: Instance) {
        super(instance, MovementComponent.className);

        this.moving = false;
        this.moveVector = vec4(0.0);
        this.speed = 1 / 10;
        this.camera = null;
        this.cameraAngle = null;
    }

    private updateCamera(): void {
        let camera = this.instance.getScene().getCamera(),
            position = this.instance.getPosition(),
            
            xt = position.x * GRID_SIZE + GRID_SIZE / 2,
            yt = position.y * GRID_SIZE,
            zt = position.z * GRID_SIZE + GRID_SIZE / 2,
            
            c = Math.cos(this.cameraAngle.z),
            xf = xt + 30 * Math.cos(this.cameraAngle.y) * c,
            yf = yt + 30 * Math.sin(this.cameraAngle.z),
            zf = zt - 30 * Math.sin(this.cameraAngle.y) * c;

        camera.setTarget(xt, yt, zt);
        camera.setPosition(xf, yf, zf);

        this.instance.setRotation(this.cameraAngle.x, this.cameraAngle.y, -this.cameraAngle.z);
    }

    public start(): void {
        this.moving = false;
    }

    public update(): void {
        if (this.moving) {
            let hor = this.moveVector.z - this.moveVector.x,
                ver = this.moveVector.w - this.moveVector.y;

            let x = this.speed * ((hor > 0)? 1 : (hor < 0)? -1 : 0),
                z = this.speed * ((ver > 0)? 1 : (ver < 0)? -1 : 0);

            this.instance.setPosition(x, 0.0, z, true);

            this.moveVector.add(x, z, 0, 0);

            if (Math.abs(hor) < this.speed && Math.abs(ver) < this.speed) {
                this.instance.setPosition(this.moveVector.z, 0.0, this.moveVector.w, false);
                this.moving = false;
                this.moveVector.set(0.0, 0.0, 0.0, 0.0);
            }

            if (this.camera != null) {
                this.updateCamera();
            }
        }
    }

    public moveTo(xTo: number, zTo: number): void {
        if (this.moving) { return; }
        
        let ins = this.instance,
            pos = ins.getPosition(),
            scene: DungeonScene = <DungeonScene> ins.getScene();

        if (!scene.isSolid(pos.x + xTo, pos.z + zTo)) {
            this.moveVector.set(pos.x, pos.z, pos.x + xTo, pos.z + zTo);
            this.moving = true;
        }
    }

    public setPosition(x: number, y: number, z: number): void {
        this.instance.setPosition(x, y, z);
        if (this.camera != null) {
            this.updateCamera();
        }
    }

    public rotateCamera(x: number): void {
        this.cameraAngle.add(0, DegToRad(x), 0);
        this.updateCamera();
    }

    public setCamera(camera: Camera): void {
        this.camera = camera;
        this.cameraAngle = vec3(0.0, DegToRad(225), DegToRad(45));

        this.updateCamera();
    }
}

export default MovementComponent;