export function createLine(text: string): HTMLDivElement {

    let eLine = document.createElement('div') as HTMLDivElement;
    eLine.className = 'line';
    eLine.contentEditable = 'true';
    eLine.innerText = text;
    eLine.addEventListener('keydown', function (event) {

        if (event.keyCode == 13) {
            console.log(event.keyCode);

            return false;
        }
    })

    return eLine;
}

export function createLineNumber(num: number): HTMLDivElement {
    let eNum = document.createElement('div');
    eNum.className = 'lineNumber';
    eNum.innerText = num + '.   ';

    return eNum;
}

export function createNextLineNumber(): HTMLDivElement {
    let numbers = document.getElementById('lineNumbers') as HTMLDivElement;
    let children = numbers.getElementsByTagName('div');

    let child = children[children.length - 1];
    let num = child.innerText.split('.')[0];

    return createLineNumber(Number.parseInt(num) + 1);
}