import { createLine, createLineNumber } from './factories/elementFactory.js';

function createLines(text: string): string[] {
    let lines = text.split('\n');
    return lines;
}

export function buildEditor(text: string) {
    let editor = document.getElementById('editor') as HTMLDivElement;
    editor.innerText = '';

    let linenumbers = document.getElementById('lineNumbers') as HTMLDivElement;
    linenumbers.innerText = '';
    let num = 1;

    createLines(text).forEach(l => {
        linenumbers.appendChild(createLineNumber(num));
        num++;
        editor.appendChild(createLine(l));
    });
}