import Geometry from '../engine/geometries/Geometry';
import DungeonMaterial from '../engine/materials/DungeonMaterial';
import Renderer from '../engine/Renderer';
import Instance from '../Instance';
import { Data, TILESETS, TILESETS_UVS } from '../Data';
import { GRID_SIZE } from '../engine/Constants';
import Scene from '../scenes/Scene';
import { TileFactory, MapTile } from './TileFactory';

export interface Dungeon {
    map: Array<Array<MapTile>>,
    instance: Instance
}

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

    private static addWall(geometry: Geometry, x: number, z: number, uvs: Array<number>, horizontal: boolean, flip: boolean): void {
        x *= GRID_SIZE;
        z *= GRID_SIZE;
        let w = GRID_SIZE,
            h = GRID_SIZE * 1.5,
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

        if (flip) {
            geometry.addTriangle(ind + 0, ind + 2, ind + 1);
            geometry.addTriangle(ind + 1, ind + 2, ind + 3);
        } else {
            geometry.addTriangle(ind + 0, ind + 1, ind + 2);
            geometry.addTriangle(ind + 1, ind + 3, ind + 2);
        }
    }

    private static generateMap(): Array<Array<number>> {
        let ret: Array<Array<number>> = [
            [ 5,  5,  5,  5,  5,  5,  5,  5,  5,  0,  0,  0,  0,  0,  0],
            [ 5,  1,  1,  1,  1,  1,  1,  1,  5,  5,  5,  5,  5,  5,  5],
            [ 5,  1,  1,  1,  1,  1,  1,  1,  5,  5,  1,  1,  1,  1,  5],
            [ 5,  1,  1,  1,  1,  1,  1,  1,  5,  5,  1,  1,  1,  1,  5],
            [ 5,  1,  1,  1,  1,  1,  1,  1,  5,  5,  1,  1,  1,  1,  5],
            [ 5,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  5],
            [ 5,  1,  1,  1,  1,  1,  1,  1,  5,  5,  1,  1,  1,  1,  5],
            [ 5,  1,  1,  1,  1,  1,  1,  1,  5,  5,  1,  1,  1,  1,  5],
            [ 5,  1,  1,  1,  1,  1,  1,  1,  5,  5,  5,  5,  5,  5,  5],
            [ 5,  5,  5,  5,  5,  5,  5,  5,  5,  0,  0,  0,  0,  0,  0]
        ];

        return ret;
    }

    private static parseMap(map: Array<Array<number>>): Array<Array<MapTile>> {
        let ret: Array<Array<MapTile>> = [],
            w = map[0].length,
            h = map.length;

        for (let y=0;y<h;y++) {
            ret[y] = [];

            for (let x=0;x<w;x++) {
                ret[y][x] = TileFactory.getTile(map[y][x]);
            }
        }

        return ret;
    };

    public static createDungeon(scene: Scene, renderer: Renderer): Dungeon {
        let geometry: Geometry = new Geometry(),
            tileset = Data.tileset[TILESETS.DUNGEON],
            material: DungeonMaterial = new DungeonMaterial(renderer, tileset.texture),
            map = this.parseMap(this.generateMap());
        
        let w = map[0].length,
            h = map.length;
        for (let x=0;x<w;x++) {
            for (let z=0;z<h;z++) {
                let tile = (map[z][x] && map[z][x].code)? map[z][x].code : 0;

                if (tile == TileFactory.TILES.FLOOR) {
                    DungeonFactory.addFloor(geometry, x, z, tileset.tiles[TILESETS_UVS.DUNGEON_FLOOR]);
                } else if (tile == TileFactory.TILES.WALL) {
                    let lt = (map[z][x-1] && !map[z][x-1].solid)? true : false,
                        rt = (map[z][x+1] && !map[z][x+1].solid)? true : false,
                        bt = (map[z+1] && map[z+1][x] && !map[z+1][x].solid)? true : false,
                        tt = (map[z-1] && map[z-1][x] && !map[z-1][x].solid)? true : false;

                    if (bt) { DungeonFactory.addWall(geometry, x, z+1, tileset.tiles[TILESETS_UVS.DUNGEON_FLOOR], true, false); }
                    if (tt) { DungeonFactory.addWall(geometry, x, z, tileset.tiles[TILESETS_UVS.DUNGEON_FLOOR], true, true); }
                    if (lt) { DungeonFactory.addWall(geometry, x, z, tileset.tiles[TILESETS_UVS.DUNGEON_FLOOR], false, false); }
                    if (rt) { DungeonFactory.addWall(geometry, x+1, z, tileset.tiles[TILESETS_UVS.DUNGEON_FLOOR], false, true); }
                }
            }
        }

        geometry.build(renderer);

        let instance: Instance = new Instance(scene, null, geometry, material);
        instance.isStatic = true;

        return {
            map, 
            instance
        }
    }
}

export { DungeonFactory };