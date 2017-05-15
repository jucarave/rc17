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

export let SPRITES = {
    CHARACTERS: "characters"
};

export let ANIMATIONS = {
    HERO_STAND: "hero_stand"
}

abstract class Data {
    public static sprites      : SpritesMap;

    private static parseAnimations(textureJSON: any, animations: AnimationMap): void {
        for (let animation in textureJSON.animations) {
            let anim = new Animation(animation);

            for (let j=0,frame;frame=textureJSON.animations[animation][j];j++) {
                anim.addFrame(frame[0] / textureJSON.width, frame[1] / textureJSON.height, frame[2] / textureJSON.width, frame[3] / textureJSON.height);
            }

            animations[animation] = anim;
        }

        console.log(Data.sprites);
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

    public static loadData(renderer: Renderer, callback: Function): void {
        Data.sprites = {};

        loadJSON('data/data.json', (response: any) => {
            Data.parseTextures(response.textures, renderer);

            callback();
        });
    }
}

export { Data };