import SpriteGeometry from '../engine/geometries/SpriteGeometry';
import SpriteMaterial from '../engine/materials/SpriteMaterial';
import Renderer from '../engine/Renderer';
import { Vector3 } from '../math/Vector3';
import { DegToRad } from '../math/Utils';
import MovementComponent from '../components/MovementComponent';
import PlayerComponent from '../components/PlayerComponent';
import AIRandomComponent from '../components/AIRandomComponent';
import Instance from '../Instance';
import { Data, SPRITES, ANIMATIONS } from '../Data';
import Scene from '../scenes/Scene';

abstract class CharacterFactory {
    public static createPlayer(scene: Scene, renderer: Renderer, position: Vector3): Instance {
        let geometry = new SpriteGeometry(renderer, 6.4, 6.4);
        let sprite = Data.sprites[SPRITES.CHARACTERS];
        
        let material = new SpriteMaterial(renderer, sprite.texture);
        material.addAnimation(sprite.animations[ANIMATIONS.HERO_STAND]);

        let instance = new Instance(scene, position, geometry, material);

        instance.addComponent(new MovementComponent(instance));
        instance.addComponent(new PlayerComponent(instance));

        instance.setRotation(0, DegToRad(-45), 0);

        instance.setSolid();

        instance.isBillboard = true;

        return instance;
    }

    public static createEnemy(scene: Scene, renderer: Renderer, position: Vector3): Instance {
        let geometry = new SpriteGeometry(renderer, 6.4, 6.4);
        let sprite = Data.sprites[SPRITES.CHARACTERS];
        
        let material = new SpriteMaterial(renderer, sprite.texture);
        material.addAnimation(sprite.animations[ANIMATIONS.RAT_STAND]);

        let instance = new Instance(scene, position, geometry, material);

        instance.addComponent(new MovementComponent(instance));
        instance.addComponent(new AIRandomComponent(instance));

        instance.setRotation(0, DegToRad(-45), 0);

        instance.setSolid();

        instance.isBillboard = true;

        return instance;
    }
}

export default CharacterFactory;