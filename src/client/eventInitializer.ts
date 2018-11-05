import { createNextLineNumber, removeLastNumber } from './utils/lineNumberUtil.js'

var KeyCode = {
    ENTER: 13,
};

function newLine() {
    //create new line
    let nums = document.getElementById('lineNumbers') as HTMLDivElement;
    nums.appendChild(createNextLineNumber());
}

function updateUI() {
    let numbers = document.getElementById('lineNumbers') as HTMLDivElement;
    let children = numbers.getElementsByTagName('div');
    let child = children[children.length - 1];
    let lastNum = Number.parseInt(child.innerText.split('.')[0]);

    let editor = document.getElementById('editor') as HTMLDivElement;
    let numLines = editor.innerText.split('').length;

    console.log(lastNum);
    console.log(numLines);



    if (lastNum < numLines) {
        createNextLineNumber();
        lastNum++;
    } else {
        removeLastNumber();
        lastNum--;
    }

}


let functions: any = {};
functions[KeyCode.ENTER] = newLine; //enter

export function setEventHandlers() {
    document.addEventListener('keydown', function (event) {
        let fun = functions[event.keyCode];
        if (fun) {
            fun();
        }

        updateUI();
    })

}

