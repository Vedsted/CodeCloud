import { createNextLineNumber } from './factories/elementFactory.js'

var KeyCode = {
    ENTER: 13,
    ARROWUP: 38,
    ARROWDOWN: 40,
};

function moveUp() {
    let lines = document.getElementsByClassName('line');

    for (let i = 0; i < lines.length; i++) {
        const e = lines[i];

        if (e === document.activeElement && i != 0) {
            (lines[i - 1] as HTMLElement).focus();
            return;
        }

    }
}

function moveDown() {
    let lines = document.getElementsByClassName('line');

    for (let i = 0; i < lines.length; i++) {
        const e = lines[i];

        if (e === document.activeElement && i != lines.length - 1) {
            (lines[i + 1] as HTMLElement).focus();
            return;
        }

    }
}

function newLine() {
    //create new line
    let nums = document.getElementById('lineNumbers') as HTMLDivElement;
    nums.appendChild(createNextLineNumber());


    //push text after the cursor to the new line

    //move cursor down
}


let functions: any = {};
functions[KeyCode.ENTER] = newLine; //enter
functions[KeyCode.ARROWUP] = moveUp; // arrowUp
functions[KeyCode.ARROWDOWN] = moveDown; // arrowDown

export function setEventHandlers() {
    document.addEventListener('keydown', function (event) {
        let fun = functions[event.keyCode];
        if (fun) {
            fun();
        }
    })

}

