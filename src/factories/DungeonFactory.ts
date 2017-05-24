import Geometry from '../engine/geometries/Geometry';
import DungeonMaterial from '../engine/materials/DungeonMaterial';
import Renderer from '../engine/Renderer';
import Instance from '../Instance';
import { Data, TILESETS, TILESETS_UVS } from '../Data';
import { GRID_SIZE } from '../engine/Constants';
import Scene from '../scenes/Scene';

abstract class DungeonFactory {
    private static addFloor(geometry: Geometry, x: number, z: number, uvs: Array<number>): void {
        x *= GRID_SIZE;
        z *= GRID_SIZE;
        let w = GRID_SIZE,
            h = GRID_SIZE,
            ind = geometry.verticesCount;

        geometry.addVertice(x, 0, z + h);
        geometry.addVertice(x + w, 0, z + h);
        geometry.addVertice(x, 0, z);
        geometry.addVertice(x + w, 0, z);

        geometry.addTextCoord(uvs[0], uvs[3]);
        geometry.addTextCoord(uvs[2], uvs[3]);
        geometry.addTextCoord(uvs[0], uvs[1]);
        geometry.addTextCoord(uvs[2], uvs[1]);

        geometry.addTriangle(ind + 0, ind + 1, ind + 2);
        geometry.addTriangle(ind + 1, ind + 3, ind + 2);
    }

    private static addWall(geometry: Geometry, x: number, z: number, uvs: Array<number>, horizontal: boolean): void {
        x *= GRID_SIZE;
        z *= GRID_SIZE;
        let w = GRID_SIZE,
            h = GRID_SIZE * 2,
            ind = geometry.verticesCount;

        if (horizontal) {
            geometry.addVertice(x, 0, z);
            geometry.addVertice(x + w, 0, z);
            geometry.addVertice(x, h, z);
            geometry.addVertice(x + w, h, z);
        } else {
            geometry.addVertice(x, 0, z);
            geometry.addVertice(x, 0, z + w);
            geometry.addVertice(x, h, z);
            geometry.addVertice(x, h, z + w);
        }

        geometry.addTextCoord(uvs[0], uvs[3]);
        geometry.addTextCoord(uvs[2], uvs[3]);
        geometry.addTextCoord(uvs[0], uvs[1]);
        geometry.addTextCoord(uvs[2], uvs[1]);

        geometry.addTriangle(ind + 0, ind + 1, ind + 2);
        geometry.addTriangle(ind + 1, ind + 3, ind + 2);
    }

    private static generateMap(): Array<Array<string>> {
        let ret: Array<Array<string>> = [
            ['#', '#', '#', '#', '#', '#', '#', '#', '#',  '',  '',  '',  '',  '',  ''],
            ['#', '.', '.', '.', '.', '.', '.', '.', '#', '#', '#', '#', '#', '#', '#'],
            ['#', '.', '.', '.', '.', '.', '.', '.', '#', '#', '.', '.', '.', '.', '#'],
            ['#', '.', '.', '.', '.', '.', '.', '.', '#', '#', '.', '.', '.', '.', '#'],
            ['#', '.', '.', '.', '.', '.', '.', '.', '#', '#', '.', '.', '.', '.', '#'],
            ['#', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '#'],
            ['#', '.', '.', '.', '.', '.', '.', '.', '#', '#', '.', '.', '.', '.', '#'],
            ['#', '.', '.', '.', '.', '.', '.', '.', '#', '#', '.', '.', '.', '.', '#'],
            ['#', '.', '.', '.', '.', '.', '.', '.', '#', '#', '#', '#', '#', '#', '#'],
            ['#', '#', '#', '#', '#', '#', '#', '#', '#',  '',  '',  '',  '',  '',  '']
        ];

        return ret;
    }

    public static createDungeon(scene: Scene, renderer: Renderer): Instance {
        let geometry: Geometry = new Geometry(),
            tileset = Data.tileset[TILESETS.DUNGEON],
            material: DungeonMaterial = new DungeonMaterial(renderer, tileset.texture),
            map = this.generateMap();
        
        let w = map[0].length,
            h = map.length;
        for (let x=0;x<w;x++) {
            for (let z=0;z<h;z++) {
                let tile = map[z][x];

                if (tile == '.') {
                    DungeonFactory.addFloor(geometry, x, z, tileset.tiles[TILESETS_UVS.DUNGEON_FLOOR]);
                } else if (tile == '#') {
                    let lt = (map[z][x-1] == '.')? true : false,
                        bt = (map[z+1] && map[z+1][x] == '.')? true : false;

                    if (bt) {
                        DungeonFactory.addWall(geometry, x, z+1, tileset.tiles[TILESETS_UVS.DUNGEON_FLOOR], true);
                    }

                    if (lt) {
                        DungeonFactory.addWall(geometry, x, z, tileset.tiles[TILESETS_UVS.DUNGEON_FLOOR], false);
                    }
                }
            }
        }

        geometry.build(renderer);

        let instance: Instance = new Instance(scene, null, geometry, material);
        instance.isStatic = true;

        return instance
    }
}

export default DungeonFactory;