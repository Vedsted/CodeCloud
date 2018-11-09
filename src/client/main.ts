import { SendText } from '../shared/requestObjects/sendTextObject.js';
import { updateText } from '../shared/editorUtil.js';
// @ts-ignore
var editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/javascript");


// @ts-ignore
const socket = io('/collab');

var changeLock = false;

/*
document.addEventListener('keydown', function (event) {
    if (editor.getValue()) {
    }
});
*/

editor.session.on('change', function (event: any) {

    if (changeLock) return
    console.log(event);
    let request = new SendText(event.action, event.start, event.lines, event.end);
    socket.emit('sendText', JSON.stringify(request));
})


socket.on('updateText', (data: any) => {

    changeLock = true;
    updateText(data, editor);
    changeLock = false;

});

console.log(socket);
// setEventHandlers();

// document.addEventListener('keydown',function (event) {
//     if (event.keyCode == 13){
//
//     }
// })




