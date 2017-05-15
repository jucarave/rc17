import Renderer from './engine/Renderer';
import { $ } from './math/Utils';
import Scene from './scenes/Scene';
import DungeonScene from './scenes/DungeonScene';
import { Data } from './Data';

class App {
    private renderer        : Renderer;
    private scene           : Scene;

    constructor() {
        this.renderer = new Renderer(854, 480, $("divGame"));

        Data.loadData(this.renderer, () => this.newGame());
    }

    private newGame(): void {
        this.scene = new DungeonScene(this.renderer);

        this.loopGame();
    }

    private loopGame(): void {
        this.renderer.clear();

        this.scene.render();

        requestAnimationFrame(() => {
            this.loopGame();
        })
    }
}

window.onload = () => {
    new App();
}