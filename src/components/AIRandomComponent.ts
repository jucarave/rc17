import Instance from '../Instance';
import DungeonScene from '../scenes/DungeonScene';
import Component from './Component';
import MovementComponent from './MovementComponent';

class AIRandomComponent extends Component {
    private mvComponent                 : MovementComponent;
    private scene                       : DungeonScene;

    public static readonly className        : string = "aiRandomComponent";

    constructor(instance: Instance) {
        super(instance, AIRandomComponent.className);

        this.mvComponent = null;
        this.scene = null;
    }

    public start(): void {
        this.mvComponent = this.instance.getComponent<MovementComponent>(MovementComponent.className);
        if (!this.mvComponent) { throw new Error("AI Random component requires Movement component to be attached"); }

        this.scene = <DungeonScene>this.instance.getScene();
    }

    public update(): void {

    }
}

export default AIRandomComponent;