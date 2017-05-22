import Geometry from '../engine/geometries/Geometry';
import Material from '../engine/materials/Material';
import DungeonMaterial from '../engine/materials/DungeonMaterial';
import Renderer from '../engine/Renderer';
import Instance from '../Instance';
import { Data, TILESETS, TILESETS_UVS } from '../Data';
import { GRID_SIZE } from '../engine/Constants';
import Scene from '../scenes/Scene';

abstract class DungeonFactory {
    private static addFloor(geometry: Geometry, x: number, z: number, w: number, h: number): void {
        x *= GRID_SIZE;
        z *= GRID_SIZE;
        w *= GRID_SIZE;
        h *= GRID_SIZE;

        geometry.addVertice(x, 0, z + h);
        geometry.addVertice(x + w, 0, z + h);
        geometry.addVertice(x, 0, z);
        geometry.addVertice(x + w, 0, z);

        geometry.addTextCoord(0, 1);
        geometry.addTextCoord(1, 1);
        geometry.addTextCoord(0, 0);
        geometry.addTextCoord(1, 0);

        geometry.addTriangle(0, 1, 2);
        geometry.addTriangle(1, 3, 2);
    }

    public static createDungeon(scene: Scene, renderer: Renderer): Instance {
        let geometry: Geometry = new Geometry(),
            tileset = Data.tileset[TILESETS.DUNGEON],
            material: Material = new DungeonMaterial(renderer, tileset.texture, tileset.tiles[TILESETS_UVS.DUNGEON_FLOOR]);
        
        DungeonFactory.addFloor(geometry, 0, 0, 10, 10);

        geometry.build(renderer);

        let instance: Instance = new Instance(scene, null, geometry, material);
        instance.isStatic = true;

        return instance
    }
}

export default DungeonFactory;