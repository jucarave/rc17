import Renderer from './engine/Renderer';
import Texture from './engine/Texture';
import Animation from './engine/Animation';
import { loadJSON } from './math/Utils';

interface AnimationMap {
    [index: string] : Animation;
}

interface SpriteObject {
    texture: Texture;
    animations: AnimationMap
}

interface SpritesMap {
    [index: string] : SpriteObject;
}

interface Tiles {
    [index: string] : Array<number>;
}

interface TilesetObject {
    texture: Texture;
    tiles: Tiles
}

interface TilesetMap {
    [index: string] : TilesetObject;
}

interface ItemsMap {
    [index: string]: CharacterData;
}

export let SPRITES = {
    CHARACTERS: "characters"
};

export let ANIMATIONS = {
    HERO_STAND: "hero_stand",
    RAT_STAND: "rat_stand"
};

export let TILESETS = {
    DUNGEON: "dungeon"
};

export let TILESETS_UVS = {
    DUNGEON_FLOOR: "floor"
};

export type itemType = 'CHARACTER';

export interface CharacterData {
    ID: string,
    type: itemType,
    name: string,
    sprite: string,
    level: number,
    HP: number,
    MP: number,
    SP: number,
    attack: number,
    defense: number,
    speed: number,
    wisdom: number,
    luck: number
}

abstract class Data {
    private static sprites      : SpritesMap;
    private static tileset      : TilesetMap;
    private static playerData   : CharacterData;
    private static itemsData    : ItemsMap;

    private static parseAnimations(textureJSON: any, animations: AnimationMap): void {
        for (let animation in textureJSON.animations) {
            let anim = new Animation(animation);

            anim.setSpeed(textureJSON.animations[animation].speed || 0);

            for (let j=0,frame;frame=textureJSON.animations[animation].frames[j];j++) {
                anim.addFrame(frame[0] / textureJSON.width, 
                              frame[1] / textureJSON.height, 
                              frame[2] / textureJSON.width, 
                              frame[3] / textureJSON.height);
            }

            animations[animation] = anim;
        }
    }

    private static parseTextures(textures: any, renderer: Renderer): void {
        for (let i=0,texture:any;texture=textures[i];i++) {
            let animations: AnimationMap = {};
            let obj: SpriteObject = {
                texture: new Texture(texture.src, renderer),
                animations: animations
            };

            this.parseAnimations(texture, animations);

            Data.sprites[texture.name] = obj;
        }
    }

    private static parseTiles(tiles: Tiles, tileset: any, tilesJSON: any): void {
        for (let i in tilesJSON) {
            let obj = tilesJSON[i];
            let tile = [
                obj[0] / tileset.width,
                obj[1] / tileset.height,
                obj[2] / tileset.width,
                obj[3] / tileset.height
            ];

            tiles[i] = tile;
        }
    }

    private static parseTileset(tilesets: any, renderer: Renderer): void {
        for (let i=0,tileset;tileset=tilesets[i];i++) {
            let tiles: Tiles = {};
            let obj: TilesetObject = {
                texture: new Texture(tileset.src, renderer),
                tiles: tiles
            }

            this.parseTiles(tiles, tileset, tileset.tiles);

            Data.tileset[tileset.name] = obj;
        }
    }

    private static parseItems(items: any): void {
        Data.itemsData = {};

        for (let i=0,item;item=items[i];i++) {
            let data: CharacterData = {
                ID: item.ID,
                type: item.type,
                name: item.name,
                sprite: item.sprite,
                level: item.level,
                HP: item.HP,
                MP: item.MP,
                SP: item.SP,
                attack: item.attack,
                defense: item.defense,
                speed: item.speed,
                wisdom: item.wisdom,
                luck: item.luck
            };

            Data.itemsData[data.ID] = data;
        }

        console.log(Data.itemsData);
    }

    public static loadData(renderer: Renderer, callback: Function): void {
        Data.sprites = {};
        Data.tileset = {};

        loadJSON('data/data.json', (response: any) => {
            Data.parseTextures(response.sprites, renderer);
            Data.parseTileset(response.tileset, renderer);
            Data.parseItems(response.items);

            callback();
        });
    }

    public static createPlayer(name: string): void {
        Data.playerData = {
            ID: "0x0000",
            type: "CHARACTER",
            sprite: 'hero',
            name: name,
            level: 1,
            HP: 20,
            MP: 20,
            SP: 20,
            attack: 5,
            defense: 5,
            speed: 5,
            wisdom: 5,
            luck: 5
        };
    }

    public static getPlayerData(): CharacterData {
        return Data.playerData;
    }

    public static getSprites(): SpritesMap {
        return Data.sprites;
    }

    public static getTileset(): TilesetMap {
        return Data.tileset;
    }

    public static getItems(): ItemsMap {
        return Data.itemsData;
    }

    public static getItem(itemCode: string): CharacterData {
        return Data.itemsData[itemCode];
    }
}

export { Data };