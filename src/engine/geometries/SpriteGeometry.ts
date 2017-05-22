import Geometry from './Geometry';
import Renderer from '../Renderer';

class SpriteGeometry extends Geometry {
    private width           : number;
    private height          : number;

    constructor(renderer: Renderer, width: number, height: number) {
        super();

        this.width = width;
        this.height = height;

        this.buildGeometry(renderer);
    }

    private buildGeometry(renderer: Renderer): void {
        let w = this.width / 2,
            h = this.height / 2;

        this.addVertice(-w,  -h, 0.0);
        this.addVertice( w,  -h, 0.0);
        this.addVertice(-w,   h, 0.0);
        this.addVertice( w,   h, 0.0);

        this.addTextCoord(0.0, 1.0);
        this.addTextCoord(1.0, 1.0);
        this.addTextCoord(0.0, 0.0);
        this.addTextCoord(1.0, 0.0);

        this.addTriangle(0, 1, 2);
        this.addTriangle(1, 3, 2);

        this.build(renderer);
    }
}

export default SpriteGeometry;