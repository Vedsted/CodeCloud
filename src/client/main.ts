import { SendText } from '../shared/requestObjects/sendTextObject.js';

// @ts-ignore
var editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/javascript");


// @ts-ignore
const socket = io('/collab');
socketSetUp();
socket.emit('joinRoom', 'testFile1');

var changeLock = false;

function socketSetUp() {

    editor.session.on('change', function (event: any) {

        if (changeLock) return
        console.log(event);
        let request = new SendText(event.action, event.start, event.lines, event.end);
        socket.emit('sendText', JSON.stringify(request));
    })

    socket.on('joinedRoom', () => {
        console.log('Room joined!');

        socket.emit('getText')
    })

    socket.on('receiveText', (data: any) => {
        changeLock = true;
        console.log("Receive text data = " + data.data)
        editor.session.setValue(data.data, 0);
        changeLock = false;
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

        }
        changeLock = false;

    });
}


console.log(socket);
