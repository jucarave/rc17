import Instance from '../Instance';
import Component from './Component';

class MovementComponent extends Component {
    private moving              : boolean;

    constructor(instance: Instance) {
        super(instance, "movementComponent");

        this.moving = false;
    }

    public start(): void {
    }

    public update(): void {

    }

    public destroy(): void {

    }
}

export default MovementComponent;