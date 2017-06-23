import Instance from '../entities/Instance';

abstract class Component {
    protected instance            : Instance;
    
    public readonly name          : string;

    constructor(instance: Instance, name: string) {
        this.instance = instance;
        this.name = name;
    }

    public start(): void { }
    public update(): void { }
    public destroy(): void { }
}

export default Component;