import Shader from './Shader';

export interface ShaderStructure {
    vertexShader: string,
    fragmentShader: string
}

export interface ShaderMap {
    [index: string]: Shader
};

export let ShaderType = {
    BASIC: "BASIC",
    DUNGEON: "DUNGEON"
};

export type ShadersNames = 'BASIC' | 'DUNGEON';