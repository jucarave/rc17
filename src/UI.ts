import Camera from './engine/Camera';
import { CAMERA_ORTHO_WIDTH, CAMERA_ORTHO_HEIGHT, CAMERA_ORTHO_ZFAR, CAMERA_ORTHO_ZNEAR} from './engine/Constants';

abstract class UI {
    private static camera               : Camera;

    public static init() {
        this.camera = Camera.createOrthographic(CAMERA_ORTHO_WIDTH, CAMERA_ORTHO_HEIGHT, CAMERA_ORTHO_ZNEAR, CAMERA_ORTHO_ZFAR);
        this.camera.setPosition(0, 0, 10);
        this.camera.setTarget(0, 0, 0);
    }
}

export default UI;