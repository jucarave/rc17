export interface MapTile {
    code: number;
    solid: boolean;
}

abstract class TileFactory {
    public static readonly TILES = {
        NONE        : 0,
        FLOOR       : 1,
        WALL        : 5
    };

    public static getTile(tile: number): MapTile {
        if (tile == TileFactory.TILES.NONE) { return null; }

        let ret: MapTile = {
            code: tile,
            solid: false
        }

        if (tile == TileFactory.TILES.WALL) {
            ret.solid = true;
        }

        return ret;
    }
}

export { TileFactory } ;