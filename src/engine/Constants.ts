export const VERTICE_SIZE = 3;
export const TEXT_COORD_SIZE = 2;

export const GRID_SIZE = 6.4;
export const WALL_SIZE = 9.6;
export const PIXEL_SCALE = 0.1;

export const CANVAS_WIDTH = 854;
export const CANVAS_HEIGHT = 480;

export const CAMERA_ORTHO_WIDTH = 85.4;
export const CAMERA_ORTHO_HEIGHT = 48.0;
export const CAMERA_ORTHO_ZNEAR = 0.1;
export const CAMERA_ORTHO_ZFAR = 1000.0;

export const GL_STATIC_DRAW = 35044;
export const GL_DYNAMIC_DRAW = 35048;


let buffer: ArrayBuffer = new ArrayBuffer(4),
    data8: Uint8Array = new Uint8Array(buffer),
    data32: Uint32Array = new Uint32Array(buffer),
    little = true;

data32[0] = 0x0a0b0c0d;

if (data8[0] == 0x0a && data8[1] == 0x0b && data8[2] == 0x0c && data8[3] == 0x0d) {
    little = false;
}

data8 = null; data32 = null; buffer = null;

export const LITTLE_ENDIAN = little;