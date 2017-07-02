import SpriteGeometry from '../engine/geometries/SpriteGeometry';
import SpriteMaterial from '../engine/materials/SpriteMaterial';
import Renderer from '../engine/Renderer';
import { Vector3 } from '../math/Vector3';
import { DegToRad } from '../math/Utils';
import CharacterComponent from '../components/CharacterComponent';
import MovementComponent from '../components/MovementComponent';
import PlayerComponent from '../components/PlayerComponent';
import AIRandomComponent from '../components/AIRandomComponent';
import Instance from '../entities/Instance';
import { Data, CharacterData, ItemData } from '../Data';
import Scene from '../scenes/Scene';

abstract class EntityFactory {
    public static createPlayer(scene: Scene, renderer: Renderer, position: Vector3): Instance {
        let sprite = Data.getSprites()["entities"],
            animation = sprite.animations["hero_stand"],
            geometry = new SpriteGeometry(renderer, animation.size.x, animation.size.y);
        
        let material = new SpriteMaterial(renderer, sprite.texture);
        material.addAnimation(animation);

        let instance = new Instance(scene, position, geometry, material);

        instance.addComponent(new CharacterComponent(instance, Data.getPlayerData()));
        instance.addComponent(new MovementComponent(instance));
        instance.addComponent(new PlayerComponent(instance));

        instance.setRotation(0, DegToRad(-45), 0);

        instance.isBillboard = true;

        return instance;
    }

    public static createEnemy(scene: Scene, renderer: Renderer, position: Vector3, data: CharacterData): Instance {
        let spriteInfo = data.sprite.split("."),
            sprite = Data.getSprites()[spriteInfo[0]],
            animation = sprite.animations[spriteInfo[1] + "_stand"];

        if (!animation) {
            animation = sprite.animations["noSprite"];
            console.info("No sprite found for enemy: [" + data.sprite + "]");
        }

        let geometry = new SpriteGeometry(renderer, animation.size.x, animation.size.y),
            material = new SpriteMaterial(renderer, sprite.texture);
        
        material.addAnimation(animation);

        let instance = new Instance(scene, position, geometry, material);

        instance.addComponent(new CharacterComponent(instance, data));
        instance.addComponent(new MovementComponent(instance));
        instance.addComponent(new AIRandomComponent(instance));

        instance.setRotation(0, DegToRad(-45), 0);

        instance.isBillboard = true;

        return instance;
    }

    public static createItem(scene: Scene, renderer: Renderer, position: Vector3, data: ItemData): Instance {
        let spriteInfo = data.sprite.split("."),
            sprite = Data.getSprites()[spriteInfo[0]],
            animation = sprite.animations[spriteInfo[1]];

        if (!animation) {
            animation = sprite.animations["noSprite"];
            console.info("No sprite found for item: [" + data.sprite + "]");
        }

        let geometry = new SpriteGeometry(renderer, animation.size.x, animation.size.y),
            material = new SpriteMaterial(renderer, sprite.texture);

        material.addAnimation(animation);

        let instance = new Instance(scene, position, geometry, material);

        instance.isBillboard = true;
        instance.isStatic = true;

        return instance;
    }
}

export default EntityFactory;