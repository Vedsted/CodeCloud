import { Line } from './models/line.js';
import { Collaborator } from './models/collaborator.js';


function createLines(text: string): Line[] {
    let ret: Line[] = [];

    let lines = text.split('\n');

    for (let i = 0; i < lines.length; i++) {
        let e = new Line(i + 1, lines[i])
        ret.push(e);
    }

    return ret;
}

export function buildEditor(text: string) {
    let editor = document.getElementById('editor') as HTMLDivElement;
    editor.innerHTML = '';

    createLines(text).forEach(l => {
        editor.appendChild(l.createElement());
    });
}