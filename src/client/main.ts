import { SendText } from '../shared/requestObjects/sendTextObject';
import * as io from 'socket.io-client';

import * as ace from 'brace';
import 'brace/mode/javascript';
import 'brace/theme/monokai';


var editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/javascript");


const socket = io('/collab');

var changeLock = false;



editor.session.on('change', function (event: ace.EditorChangeEvent) {

    if (changeLock) return
    let request = new SendText(event.action, event.start, event.lines, event.end);
    socket.emit('sendChange', JSON.stringify(request));
})


socket.on('receiveText', (data: { data: string }) => {
    changeLock = true;
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

socket.emit('getDocument')
