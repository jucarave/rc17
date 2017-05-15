import SpriteGeometry from '../engine/geometries/SpriteGeometry';
import SpriteMaterial from '../engine/materials/SpriteMaterial';
import Renderer from '../engine/Renderer';
import Mesh from '../engine/Mesh';
import { Data, SPRITES, ANIMATIONS } from '../Data';

abstract class CharacterFactory {
    public static createPlayer(renderer: Renderer): Mesh {
        let geometry = new SpriteGeometry(renderer, 6.4, 6.4);
        let sprite = Data.sprites[SPRITES.CHARACTERS];
        
        let material = new SpriteMaterial(renderer, sprite.texture);
        material.addAnimation(sprite.animations[ANIMATIONS.HERO_STAND]);

        let mesh = new Mesh(geometry, material);

        return mesh;
    }
}

export default CharacterFactory;