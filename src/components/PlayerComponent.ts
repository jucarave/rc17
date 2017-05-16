import Instance from '../Instance';
import Component from './Component';
import MovementComponent from './MovementComponent';

class PlayerComponent extends Component {
    private mvComponent         : MovementComponent;

    public static className     : string = "playerComponent";

    constructor(instance: Instance) {
        super(instance, PlayerComponent.className);

        this.mvComponent = null;
    }

    public start(): void {
        this.mvComponent = this.instance.getComponent<MovementComponent>(MovementComponent.className);
        if (!this.mvComponent) { throw new Error("Player component requires Movement component to be attached"); }
    }

    public update(): void {
        
    }
}

export default PlayerComponent;