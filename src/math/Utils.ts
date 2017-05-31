import { LITTLE_ENDIAN } from '../engine/Constants';

export function $(elementId: string): HTMLElement {
    return document.getElementById(elementId);
}

export function DegToRad(degrees: number): number {
    return degrees * Math.PI / 180.0;
}

export function getDistance(x: number, y: number): number {
    return Math.sqrt(x*x + y*y);
}

export function loadJSON(url: string, callback: Function): void {
    let http = new XMLHttpRequest();

    http.onreadystatechange = function() {
        if (http.readyState == 4 && http.status == 200) {
            let content = JSON.parse(http.responseText);

            callback(content);
        }
    }

    http.open("GET", url, true);
    http.send();
}

export function col(r: number, g: number, b: number, a: number): number {
    if (LITTLE_ENDIAN) {
        return (a << 24 | b << 16 | g << 8 | r);
    } else {
        return (r << 24 | g << 16 | b << 8 | a);
    }
}