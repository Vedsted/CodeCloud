import { SendText } from '../shared/requestObjects/sendTextObject.js';

// @ts-ignore
var editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/javascript");


// @ts-ignore
const socket = io('/collab');

var changeLock = false;



editor.session.on('change', function (event: any) {

    if (changeLock) return
    console.log(event);
    let request = new SendText(event.action, event.start, event.lines, event.end);
    socket.emit('sendText', JSON.stringify(request));
})


socket.on('receiveText', (data: {data: string}) => {
    changeLock = true;
    console.log("Receive text data (JSON) = " + data.data)
    editor.session.setValue(data.data);
    changeLock = false;
})

socket.on('updateText', (data: string) => {

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

    }
    changeLock = false;

});

console.log(socket);
socket.emit('getText')
