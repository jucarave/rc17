class Input {
    private keyboardCallbacks       : Array<Function>;
    private mouseCallbacks          : Array<Function>;

    constructor() {
        this.keyboardCallbacks = [];
        this.mouseCallbacks = [];

        document.addEventListener("keydown", (ev: KeyboardEvent) => this.handleKeyboard(ev, 1));
        document.addEventListener("keyup", (ev: KeyboardEvent) => this.handleKeyboard(ev, 0));

        document.addEventListener("mousedown", (ev: MouseEvent) => this.handleMouse(ev, 1));
        document.addEventListener("mouseup", (ev: MouseEvent) => this.handleMouse(ev, 0));
        document.addEventListener("mousemove", (ev: MouseEvent) => this.handleMouse(ev, 2));
    }

    private handleKeyboard(ev: KeyboardEvent, type: number): void {
        let code = ev.keyCode;

        for (let i=0,callback;callback=this.keyboardCallbacks[i];i++) {
            callback(code, type);
        }
    }

    private handleMouse(ev: MouseEvent, type: number): void {
        if (!ev.target || !(<HTMLCanvasElement>ev.target).getContext) { return; }

        let canvas = <HTMLCanvasElement> ev.target,
            x = ev.clientX - canvas.offsetLeft,
            y = ev.clientY - canvas.offsetTop;

        for (let i=0,callback;callback=this.mouseCallbacks[i];i++) {
            callback(x, y, type);
        }
    }

    public onKeyboard(callback: Function): void {
        this.keyboardCallbacks.push(callback);
    } 

    public onMouse(callback: Function): void {
        this.mouseCallbacks.push(callback);
    }
}

let input = new Input;
export default input as Input;