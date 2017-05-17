import Geometry from './Geometry';
import Renderer from '../Renderer';
import { GRID_SIZE } from '../Constants';

class DungeonGeometry extends Geometry {
    constructor() {
        super();
    }

    public addFloor(x: number, y: number, z: number, w: number, h: number): void {
        this.addVertice(x, y, z + h);
        this.addVertice(x + w, y, z + h);
        this.addVertice(x, y, z);
        this.addVertice(x + w, y, z);

        this.addTextCoord(0, 1);
        this.addTextCoord(1, 1);
        this.addTextCoord(0, 0);
        this.addTextCoord(1, 0);
    }

    public createDungeon(renderer: Renderer): void {
        this.addFloor(0, 0, 0, 10 * GRID_SIZE, 10 * GRID_SIZE);
        this.build(renderer);
    }
}

export default DungeonGeometry;