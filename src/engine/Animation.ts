class Animation {
    private frames          : Array<Array<number>>;
    private frameIndex      : number;
    private animationSpeed  : number;
    private pauseSpeed      : number;

    public readonly name            : string;

    constructor(name: string, frames?: Array<Array<number>>) {
        this.name = name;
        this.frames = (frames)? frames : [];
        this.frameIndex = 0;
        this.animationSpeed = 1.0;
        this.pauseSpeed = 0;
    }

    public addFrame(x: number, y: number, w: number, h: number): void {
        this.frames.push([x, y, w, h]);
    }

    public setFrameIndex(frameIndex: number) {
        this.frameIndex = frameIndex;
    }

    public setSpeed(speed: number) {
        this.animationSpeed = speed;
    }

    public pause(): Animation {
        this.pauseSpeed = this.animationSpeed;
        this.animationSpeed = 0;

        return this;
    }

    public resume(): Animation {
        this.animationSpeed = this.pauseSpeed;
        this.pauseSpeed = 0;

        return this;
    }

    public restart(): Animation {
        this.frameIndex = 0;

        return this;
    }

    public update(): void {
        if (this.frames.length <= 1) { return; }

        this.frameIndex += this.animationSpeed;
        if (this.frameIndex >= this.frames.length) {
            this.frameIndex = 0;
        }
    }

    public clone(): Animation {
        let ret = new Animation(this.name, this.frames);

        ret.setSpeed(this.animationSpeed);

        return ret;
    }

    public get frame(): Array<number> {
        return this.frames[this.frameIndex << 0];
    }
}

export default Animation;