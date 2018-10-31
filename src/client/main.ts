import { buildEditor } from './editorCreator.js'

function test() {
    fetch('http://jsonplaceholder.typicode.com/users/1')
        .then(resp => {
            return resp.json();
        }).then(obj => {
            buildEditor(JSON.stringify(obj));
        });
}

console.log('test');

test();

/*
let num = 1;
document.addEventListener('keypress', function (event) {
    if (event.keyCode !== 13) {
        return;
    }
    let line = document.createElement('div');

    num++;

    let l = document.createElement('label');
    l.innerHTML = num + '. ';

    let i = document.createElement('input');



    line.appendChild(l);
    line.appendChild(i);

    document.body.appendChild(line);
    i.focus();
})*/