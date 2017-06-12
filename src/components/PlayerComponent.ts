import Input from '../engine/Input';
import Instance from '../Instance';
import { Vector3, vec3 } from '../math/Vector3';
import DungeonScene from '../scenes/DungeonScene';
import Component from './Component';
import MovementComponent from './MovementComponent';

type KeysType = 'LEFT'|'UP'|'RIGHT'|'DOWN';

class PlayerComponent extends Component {
    private scene               : DungeonScene;
    private dragControl         : Vector3;
    private mvComponent         : MovementComponent;
    private path                : Array<number>;
    private controls = {
        UP          : 0,
        DOWN        : 0,
        LEFT        : 0,
        RIGHT       : 0
    };

    public static readonly className     : string = "playerComponent";
    public static readonly losDistance   : number = 30;

    constructor(instance: Instance) {
        super(instance, PlayerComponent.className);

        this.scene = null;
        this.mvComponent = null;
        this.dragControl = vec3(0.0);
        this.path = null;
    }

    private keyCodeToControl(keyCode: number): KeysType {
        switch (keyCode) {
            case 37: return 'LEFT';
            case 38: return 'UP';
            case 39: return 'RIGHT';
            case 40: return 'DOWN';
            default: return null;
        }
    }

    private isKeyPressed(keyCode: KeysType): number {
        if (this.controls[keyCode] == 1) {
            this.controls[keyCode] = 2;
            return 1;
        }

        return 0
    }

    private updateFOV(): void {
        this.scene.castLight(this.instance, PlayerComponent.losDistance);
    }

    private moveTo(x: number, z: number): void {
        this.path = this.scene.getPath(this.instance.getPosition().x, this.instance.getPosition().z, x, z);
        if (this.path.length == 0){ this.path = null; }
    }

    private updateMovement(): void {
        let zTo = this.isKeyPressed('DOWN') - this.isKeyPressed('UP'), 
            xTo = this.isKeyPressed('RIGHT') - this.isKeyPressed('LEFT');

        if (xTo != 0 || zTo != 0) {
            this.moveTo(this.instance.getPosition().x + xTo, this.instance.getPosition().z + zTo);
        }

        if (this.path != null && !this.mvComponent.isMoving) {
            let coords = this.path.splice(0, 2),
                pos = this.instance.getPosition();

            this.mvComponent.moveTo(coords[0] - pos.x, coords[1] - pos.z, () => this.updateFOV());

            if (this.path.length == 0) { this.path = null; }
        }
    }

    public start(): void {
        this.mvComponent = this.instance.getComponent<MovementComponent>(MovementComponent.className);
        if (!this.mvComponent) { throw new Error("Player component requires Movement component to be attached"); }

        this.scene = <DungeonScene>this.instance.getScene();

        let camera = this.scene.getCamera();
        this.mvComponent.setCamera(camera);

        Input.onKeyboard((keyCode: number, type: number) => {
            let control = this.keyCodeToControl(keyCode);
            if (!control) { return; }

            if (type == 1 && this.controls[control] == 2) {
                return;
            }

            this.controls[control] = type;
        });

        Input.onMouse((x: number, y: number, type: number) => {
            if (this.path != null) { return; }

            if (type == 0) {
                if (this.dragControl.z != 2 && !this.mvComponent.isMoving) {
                    let dir = camera.forward,
                        start = camera.screenToWorldCoords(x, y),
                        end = start.clone().add(-dir.x * 100.0, -dir.y * 100.0, -dir.z * 100.0);

                    let len = Math.abs(end.y - start.y),
                        f1 = start.y / len,
                        px = Math.floor((start.x + (end.x - start.x) * f1) / 6.4),
                        pz = Math.floor((start.z + (end.z - start.z) * f1) / 6.4);

                    this.moveTo(px, pz);
                }

                this.dragControl.set(0, 0, 0);
            } else {
                if (type == 1 && this.dragControl.z == 0) {
                    this.dragControl.set(x, y, 1);
                } else if (type == 2 && this.dragControl.z > 0){
                    let dx = x - this.dragControl.x;
                    this.dragControl.set(x, y, 2);

                    this.mvComponent.rotateCamera(dx);
                }
            }
        });
    }

    public update(): void {
        this.updateMovement();
    }
}

export default PlayerComponent;