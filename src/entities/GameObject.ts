import Renderer from '../engine/Renderer';
import Camera from '../engine/Camera';
import { Vector3, vec3 } from '../math/Vector3';
import Component from '../components/Component';
import Scene from '../scenes/Scene';

abstract class GameObject {
    protected scene               : Scene;
    protected position            : Vector3;
    protected rotation            : Vector3;
    protected components          : Array<Component>;

    constructor(scene: Scene, position?: Vector3) {
        this.scene = scene;
        this.position = (position)? position : vec3(0.0);
        this.rotation = vec3(0.0);
        this.components = [];
    }

    public setPosition(x: number, y: number, z: number, relative: boolean = false): GameObject {
        if (relative) {
            this.position.add(x, y, z);
        } else {
            this.position.set(x, y, z);
        }

        return this;
    }

    public setRotation(x: number, y: number, z: number): GameObject {
        this.rotation.set(x, y, z);

        return this;
    }

    public addComponent(component: Component): GameObject {
        this.components.push(component);

        return this;
    }

    public getComponent<T>(componentName: string): T {
        for (let i=0,component;component=this.components[i];i++) {
            if (component.name == componentName) {
                return <T>(<any>component);
            }
        }

        return null;
    }

    public getPosition(): Vector3 {
        return this.position;
    }

    public getScene(): Scene {
        return this.scene;
    }

    public abstract awake(): void;

    public abstract destroy(): void;

    public abstract update(camera: Camera): void;

    public abstract render(renderer: Renderer, camera: Camera): void;
}

export default GameObject;