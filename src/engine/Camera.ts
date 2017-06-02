import Matrix4 from '../math/Matrix4';
import { Vector3, vec3 } from '../math/Vector3';
import { CANVAS_WIDTH, CANVAS_HEIGHT, CAMERA_ORTHO_WIDTH, CAMERA_ORTHO_HEIGHT } from './Constants';

class Camera {
    private transform           : Matrix4;
    private position            : Vector3;
    private target              : Vector3;
    private up                  : Vector3;
    private angle               : Vector3;
    private needsUpdate         : boolean;

    public readonly projection          : Matrix4;

    constructor(projection: Matrix4) {
        this.projection = projection;
        this.transform = Matrix4.createIdentity();

        this.position = vec3(0, 0, 0);
        this.target = vec3(0, 0, 0);
        this.up = vec3(0, 1, 0);
        this.angle = vec3(0.0);

        this.needsUpdate = true;
    }

    public setPosition(x: number, y: number, z: number): Camera {
        this.position.set(x, y, z);

        this.needsUpdate = true;

        return this;
    }

    public setTarget(x: number, y: number, z: number): Camera {
        this.target.set(x, y, z);

        this.needsUpdate = true;

        return this;
    }

    public setAngle(x: number, y: number, z: number): Camera {
        this.angle.set(x, y, z);

        this.needsUpdate = true;

        return this;
    }

    public getAngle(): Vector3 {
        return this.angle;
    }

    public getTransformation(): Matrix4 {
        if (!this.needsUpdate) {
            return this.transform;
        }

        let f = this.forward,
            l = Vector3.cross(this.up, f).normalize(),
            u = Vector3.cross(f, l).normalize();

        let cp = this.position,
            x = -Vector3.dot(l, cp),
            y = -Vector3.dot(u, cp),
            z = -Vector3.dot(f, cp);

        Matrix4.set(
            this.transform,
            l.x, u.x, f.x, 0,
            l.y, u.y, f.y, 0,
            l.z, u.z, f.z, 0,
              x,   y,   z, 1
        );
        
        this.needsUpdate = false;

        return this.transform;
    }

    public screenToWorldCoords(x: number, y: number): Vector3 {
        let cw = (CANVAS_WIDTH / 2),
            ch = (CANVAS_HEIGHT / 2),
            ox = (x - cw) / cw * (CAMERA_ORTHO_WIDTH / 2),
            oy = (ch - y) / ch * (CAMERA_ORTHO_HEIGHT / 2);

        let f = this.forward,
            l = Vector3.cross(this.up, f).normalize(),
            u = Vector3.cross(f, l).normalize();

        l.multiply(ox);
        u.multiply(oy);

        let world = this.position.clone();

        world.add(l.x, l.y, l.z);
        world.add(u.x, u.y, u.z);

        return world;
    }

    public get forward(): Vector3 {
        let cp = this.position,
            t = this.target;

        return vec3(cp.x - t.x, cp.y - t.y, cp.z - t.z).normalize();
    }

    public static createPerspective(fov: number, ratio: number, znear: number, zfar: number): Camera {
        return new Camera(Matrix4.createPerspective(fov, ratio, znear, zfar));
    }

    public static createOrthographic(width: number, height: number, znear: number, zfar: number): Camera {
        return new Camera(Matrix4.createOrtho(width, height, znear, zfar));
    }
}

export default Camera;