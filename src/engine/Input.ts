class Input {
    private keyboardCallbacks       : Array<Function>;

    constructor() {
        this.keyboardCallbacks = [];

        document.addEventListener("keydown", (ev: KeyboardEvent) => this.handleKeyboard(ev, 1));
        document.addEventListener("keyup", (ev: KeyboardEvent) => this.handleKeyboard(ev, 0));
    }

    private handleKeyboard(ev: KeyboardEvent, type: number): void {
        let code = ev.keyCode;

        for (let i=0,callback;callback=this.keyboardCallbacks[i];i++) {
            callback(code, type);
        }
    }

    public onKeyboard(callback: Function): void {
        this.keyboardCallbacks.push(callback);
    } 
}

let input = new Input;
export default input as Input;