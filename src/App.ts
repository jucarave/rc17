import Renderer from './engine/Renderer';
import { DegToRad, $ } from './math/Utils';
import Mesh from './engine/Mesh';
import Camera from './engine/Camera';
import CharacterFactory from './factories/CharacterFactory';
import { Data } from './Data';

function render(renderer: Renderer) {
    let camera = Camera.createPerspective(DegToRad(90), 854/480, 0.1, 100.0);
    camera.setPosition(0, 0, 15);
    camera.setTarget(0, 0, 0);

    let player = CharacterFactory.createPlayer(renderer);
    loop(player, camera, renderer);
}

let angle = 0;
function loop(mesh: Mesh, camera: Camera, renderer: Renderer) {
    renderer.clear();

    mesh.setRotation(0, DegToRad(angle++), 0);
    mesh.render(renderer, camera);

    requestAnimationFrame(() => {
        loop(mesh, camera, renderer);
    })
}

class App {
    private renderer        : Renderer;

    constructor() {
        this.renderer = new Renderer(854, 480, $("divGame"));

        Data.loadData(this.renderer, () => render(this.renderer));
    }
}

window.onload = () => {
    new App();
}