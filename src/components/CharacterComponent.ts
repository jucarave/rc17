import Instance from '../entities/Instance';
import ItemDef from '../entities/ItemDef';
import Component from './Component';

class CharacterComponent extends Component {
    private ID                           : number;
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

    constructor(instance: Instance) {
        super(instance, CharacterComponent.className);

        this.ID = null;
        this.characterName = null;
        this.level = 0;
        this.experience = 0;
        this.HP = 1;
        this.mHP = 1;
        this.MP = 1;
        this.mMP = 1;
        this.SP = 1;
        this.mSP = 1;
        this.attack = 1;
        this.defense = 1;
        this.speed = 1;
        this.wisdom = 1;
        this.luck = 1;
        this.inventory = [];
    }
}

export default CharacterComponent;