import { createLineNumber } from '../factories/elementFactory.js';

export function createNextLineNumber(): HTMLDivElement {
    let numbers = document.getElementById('lineNumbers') as HTMLDivElement;
    let children = numbers.getElementsByTagName('div');

    let child = children[children.length - 1];
    let num = child.innerText.split('.')[0];

    return createLineNumber(Number.parseInt(num) + 1);
}

export function removeLastNumber() {
    let numbers = document.getElementById('lineNumbers') as HTMLDivElement;
    let children = numbers.getElementsByTagName('div');

    let child = children[children.length - 1];
    numbers.removeChild(child);
}