import { ShaderStructure } from './ShaderStructure';

let DungeonShader: ShaderStructure = {
    vertexShader: `
        precision mediump float;

        attribute vec3 aVertexPosition;
        attribute vec2 aTextureCoords;

        uniform mat4 uProjection;
        uniform mat4 uPosition;

        varying vec2 vTextCoords;
        varying vec2 vPosition;

        void main(void) {
            gl_Position = uProjection * uPosition * vec4(aVertexPosition, 1.0);

            vTextCoords = aTextureCoords;
            vPosition = aVertexPosition.xz;
        }
    `,

    fragmentShader: `
        precision mediump float;

        uniform sampler2D uTexture;
        uniform sampler2D uLightTexture;

        varying vec2 vTextCoords;
        varying vec2 vPosition;
        
        void main(void) {
            vec4 color = texture2D(uTexture, vTextCoords);

            vec2 coords = floor(vPosition / 6.4) / vec2(16.0, 16.0);
            color.rgb *= texture2D(uLightTexture, coords).rgb;

            gl_FragColor = color;
        }
    `
};

export default DungeonShader;