import Instance from '../entities/Instance';
import ItemDef from '../entities/ItemDef';
import Component from './Component';
import { CharacterData } from '../Data';

class CharacterComponent extends Component {
    private ID                           : string;
    private characterName                : string;
    private level                        : number;
    private experience                   : number;
    // TODO: Effects
    private HP                           : number;
    private mHP                          : number;
    private MP                           : number;
    private mMP                          : number;
    private SP                           : number;
    private mSP                          : number;
    private attack                       : number;
    private defense                      : number;
    private speed                        : number;
    private wisdom                       : number;
    private luck                         : number;
    private inventory                    : Array<ItemDef>;

    public static readonly className        : string = "characterComponent";

    constructor(instance: Instance, data: CharacterData) {
        super(instance, CharacterComponent.className);

        this.fillData(data);
    }

    private fillData(data: CharacterData): void {
        this.ID = data.ID;
        this.characterName = data.name;
        this.level = data.level;
        this.experience = 0;
        this.HP = data.HP;
        this.mHP = data.HP;
        this.MP = data.MP;
        this.mMP = data.MP;
        this.SP = data.SP;
        this.mSP = data.SP;
        this.attack = data.attack;
        this.defense = data.defense;
        this.speed = data.speed;
        this.wisdom = data.wisdom;
        this.luck = data.luck;
        this.inventory = []; // TODO: Parse data inventory
    }
}

export default CharacterComponent;