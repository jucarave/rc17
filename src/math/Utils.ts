export function $(elementId: string): HTMLElement {
    return document.getElementById(elementId);
}

export function DegToRad(degrees: number): number {
    return degrees * Math.PI / 180.0;
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