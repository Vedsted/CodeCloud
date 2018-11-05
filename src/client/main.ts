import { buildEditor } from './editorCreator.js'
import { setEventHandlers } from './eventInitializer.js'

function test() {
    buildEditor('function test() {\n    if(this is a test) { \n print(\'wow\');\n}\n}')
}


console.log(socket.id);
socket.emit('sendText', "A lovely message");
socket.on('updateText', (data : any)=>{
    buildEditor(data)
    console.log(data)
});
console.log(socket);

console.log('test');

//test();

setEventHandlers();



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