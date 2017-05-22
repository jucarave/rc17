import { ShaderStructure } from './ShaderStructure';

let DungeonShader: ShaderStructure = {
    vertexShader: `
        precision mediump float;

        attribute vec3 aVertexPosition;
        attribute vec2 aTextureCoords;

        uniform mat4 uProjection;
        uniform mat4 uPosition;

        varying vec2 vTextCoords;

        void main(void) {
            gl_Position = uProjection * uPosition * vec4(aVertexPosition, 1.0);

            vTextCoords = aTextureCoords;
        }
    `,

    fragmentShader: `
        precision mediump float;

        uniform sampler2D uTexture;
        uniform vec4 uSpriteRect;
        uniform vec2 uRepeatTexture;

        varying vec2 vTextCoords;
        
        void main(void) {
            vec2 coords = mod(((vTextCoords * uSpriteRect.zw)) * uRepeatTexture, uSpriteRect.zw) + uSpriteRect.xy;
            gl_FragColor = texture2D(uTexture, coords);
        }
    `
};

export default DungeonShader;