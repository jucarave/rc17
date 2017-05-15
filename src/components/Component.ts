import Instance from '../Instance';

abstract class Component {
    protected instance            : Instance;
    
    public readonly name          : string;

    constructor(instance: Instance, name: string) {
        this.instance = instance;
        this.name = name;
    }

    public abstract start(): void;
    public abstract update(): void;
    public abstract destroy(): void;
}

export default Component;