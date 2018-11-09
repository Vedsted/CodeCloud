import { SendText } from '../shared/requestObjects/sendTextObject.js';

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
    let response = JSON.parse(data) as SendText;
    if (response.action == 'insert') {

        let text = response.content.reduce(function (e1, e2) {
            return e1 + '\n' + e2;
        })

        editor.session.insert(response.positionStart, text);


    } else if (response.action == 'remove') {
        let r = {
            start: response.positionStart,
            end: response.positionEnd,
        } as any;

        editor.session.remove(r);
        //    startRow, Number startColumn, Number endRow, Number endColumn)

    }
    changeLock = false;

});

console.log(socket);
// setEventHandlers();

// document.addEventListener('keydown',function (event) {
//     if (event.keyCode == 13){
//
//     }
// })




