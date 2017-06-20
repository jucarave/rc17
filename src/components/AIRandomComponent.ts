import Instance from '../Instance';
import DungeonScene from '../scenes/DungeonScene';
import Component from './Component';
import MovementComponent from './MovementComponent';

class AIRandomComponent extends Component {
    private mvComponent                 : MovementComponent;
    private scene                       : DungeonScene;
    private path                        : Array<number>;

    public static readonly className        : string = "aiRandomComponent";

    constructor(instance: Instance) {
        super(instance, AIRandomComponent.className);

        this.mvComponent = null;
        this.scene = null;
    }

    private choosePath(): void {
        if (!this.mvComponent.isMoving) {
            let xTo = Math.round(Math.random() * 2 - 1),
                zTo = (xTo == 0)? Math.round(Math.random() * 2 - 1) : 0,
                pos = this.instance.getPosition();

            this.path = this.scene.getPath(pos.x, pos.z, pos.x + xTo, pos.z + zTo);
            if (this.path.length == 0){ 
                this.path = null; 
                this.instance.endTurn();
            }
        }
    }

    private updateMovement(): void {
        if (this.path != null && !this.mvComponent.isMoving) {
            let coords = this.path.splice(0, 2),
                pos = this.instance.getPosition();

            this.mvComponent.moveTo(coords[0] - pos.x, coords[1] - pos.z, () => {
                this.instance.endTurn();
            });

            if (this.path.length == 0) { this.path = null; }
        }
    }

    public start(): void {
        this.mvComponent = this.instance.getComponent<MovementComponent>(MovementComponent.className);
        if (!this.mvComponent) { throw new Error("AI Random component requires Movement component to be attached"); }

        this.scene = <DungeonScene>this.instance.getScene();
    }

    public update(): void {
        if (!this.instance.hasTurn()) { return; }

        this.choosePath();
        this.updateMovement();
    }
}

export default AIRandomComponent;