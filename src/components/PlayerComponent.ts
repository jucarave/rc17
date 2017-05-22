import Input from '../engine/Input';
import Instance from '../Instance';
import Component from './Component';
import MovementComponent from './MovementComponent';

type KeysType = 'LEFT'|'UP'|'RIGHT'|'DOWN';

class PlayerComponent extends Component {
    private mvComponent         : MovementComponent;
    private controls = {
        UP          : 0,
        DOWN        : 0,
        LEFT        : 0,
        RIGHT       : 0
    };

    public static className     : string = "playerComponent";

    constructor(instance: Instance) {
        super(instance, PlayerComponent.className);

        this.mvComponent = null;
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

    private updateMovement(): void {
        let zTo = this.isKeyPressed('DOWN') - this.isKeyPressed('UP'), 
            xTo = this.isKeyPressed('RIGHT') - this.isKeyPressed('LEFT');

        if (xTo != 0 || zTo != 0) {
            this.mvComponent.moveTo(xTo, zTo);
        }
    }

    public start(): void {
        this.mvComponent = this.instance.getComponent<MovementComponent>(MovementComponent.className);
        if (!this.mvComponent) { throw new Error("Player component requires Movement component to be attached"); }

        this.mvComponent.setCamera(this.instance.getScene().getCamera());

        Input.onKeyboard((keyCode: number, type: number) => {
            let control = this.keyCodeToControl(keyCode);
            if (!control) { return; }

            if (type == 1 && this.controls[control] == 2) {
                return;
            }

            this.controls[control] = type;
        });
    }

    public update(): void {
        this.updateMovement();
    }
}

export default PlayerComponent;