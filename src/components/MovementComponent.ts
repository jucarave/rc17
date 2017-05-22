import Camera from '../engine/Camera';
import { GRID_SIZE } from '../engine/Constants';
import { Vector4, vec4 } from '../math/Vector4';
import Instance from '../Instance';
import Component from './Component';

class MovementComponent extends Component {
    private moving              : boolean;
    private moveVector          : Vector4;
    private speed               : number;
    private camera              : Camera;

    public static className     : string = "movementComponent";

    constructor(instance: Instance) {
        super(instance, MovementComponent.className);

        this.moving = false;
        this.moveVector = vec4(0.0);
        this.speed = 1 / 10;
        this.camera = null;
    }

    private updateCamera(): void {
        let camera = this.instance.getScene().getCamera(),
            position = this.instance.getPosition(),
            
            x = position.x * GRID_SIZE + GRID_SIZE / 2,
            y = position.y * GRID_SIZE,
            z = position.z * GRID_SIZE + GRID_SIZE / 2;

        camera.setTarget(x, y, z);
        camera.setPosition(x - 20, y + 20, z + 20);
    }

    public start(): void {
        this.moving = false;

        this.updateCamera();
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
            pos = ins.getPosition();

        this.moveVector.set(pos.x, pos.z, pos.x + xTo, pos.z + zTo);
        this.moving = true;
    }

    public setCamera(camera: Camera): void {
        this.camera = camera;
    }
}

export default MovementComponent;