import SpriteGeometry from '../engine/geometries/SpriteGeometry';
import SpriteMaterial from '../engine/materials/SpriteMaterial';
import Renderer from '../engine/Renderer';
import { vec3 } from '../math/Vector3';
import Instance from '../Instance';
import { Data, SPRITES, ANIMATIONS } from '../Data';

abstract class CharacterFactory {
    public static createPlayer(renderer: Renderer): Instance {
        let geometry = new SpriteGeometry(renderer, 6.4, 6.4);
        let sprite = Data.sprites[SPRITES.CHARACTERS];
        
        let material = new SpriteMaterial(renderer, sprite.texture);
        material.addAnimation(sprite.animations[ANIMATIONS.HERO_STAND]);

        let instance = new Instance(vec3(0, 0, 0), geometry, material);

        return instance;
    }
}

export default CharacterFactory;