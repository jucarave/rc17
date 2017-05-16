import Instance from '../Instance';
import Component from './Component';

class MovementComponent extends Component {
    private moving              : boolean;

    public static className     : string = "movementComponent";

    constructor(instance: Instance) {
        super(instance, MovementComponent.className);

        this.moving = false;
    }

    public start(): void {
        this.moving = false;
    }

    public update(): void {
    }

    public moveTo(xTo: number, zTo: number): void {
        let ins = this.instance;

        ins.setPosition(xTo, 0, zTo, true);
    }
}

export default MovementComponent;