declare var Stats: any;

import Renderer from './engine/Renderer';
import { $ } from './math/Utils';
import Scene from './scenes/Scene';
import DungeonScene from './scenes/DungeonScene';
import { Data } from './Data';

class App {
    private renderer        : Renderer;
    private scene           : Scene;

    private stats = new Stats();

    constructor() {
        this.renderer = new Renderer(854, 480, $("divGame"));

        Data.loadData(this.renderer, () => this.newGame());
    }

    private newGame(): void {
        this.scene = new DungeonScene(this.renderer);

        this.stats.showPanel(1);
        document.body.appendChild(this.stats.dom);

        this.loopGame();
    }

    private loopGame(): void {
        this.stats.begin();

        this.renderer.clear();

        this.scene.render();

        this.stats.end();

        requestAnimationFrame(() => {
            this.loopGame();
        })
    }
}

window.onload = () => {
    new App();
}