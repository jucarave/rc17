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

    public static createDungeon(scene: Scene, renderer: Renderer): Instance {
        let geometry: Geometry = new Geometry(),
            tileset = Data.tileset[TILESETS.DUNGEON],
            material: DungeonMaterial = new DungeonMaterial(renderer, tileset.texture);
        
        for (let x=0;x<10;x++) {
            for (let z=0;z<10;z++) {
                DungeonFactory.addFloor(geometry, x, z, tileset.tiles[TILESETS_UVS.DUNGEON_FLOOR]);
            }
        }

        geometry.build(renderer);

        let instance: Instance = new Instance(scene, null, geometry, material);
        instance.isStatic = true;

        return instance
    }
}

export default DungeonFactory;