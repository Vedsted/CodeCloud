import { SendText } from '../shared/requestObjects/sendTextObject.js';
import {GetTextobj} from "../shared/requestObjects/GetTextObj";
// @ts-ignore
var editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/javascript");


// @ts-ignore
const socket = io('/collab');

var changeLock = false;
const baseURL = "http://localhost";

var latestEditTime : number = 0;

editor.session.on('change', function (event: any) {

    if (changeLock) return
    let request = new SendText(event.action, event.start, event.lines, event.end);
    var ajaxRequest = new XMLHttpRequest();
    ajaxRequest.open("POST", baseURL + '/editText');
    ajaxRequest.setRequestHeader('Content-Type', 'application/json');
    ajaxRequest.send(JSON.stringify(request));
})



    window.addEventListener('load', () => longPoll());

function longPoll(){
    fetch(baseURL + '/Polling?latestChange=' + latestEditTime)
        .then(res =>res.json())
        .then(json => {
            changeLock = true;
            console.log(json);
            if (json != '') {
                let response = json as GetTextobj;
                latestEditTime = response.lastEditTime;
                var cursorpos = editor.getCursorPosition();
                editor.session.setValue(response.content);
                editor.selection.moveTo(cursorpos.row, cursorpos.column);
                changeLock = false;
            }
        })
        .then(()=>setTimeout(longPoll,0))
        .catch(rej => console.log("Error: ", rej));
}



// socket.on('receiveText', (data: {data: string}) => {
//     changeLock = true;
//     console.log("Receive text data (JSON) = " + data.data)
//     editor.session.setValue(data.data);
//     changeLock = false;
// })
//
// socket.on('updateText', (data: string) => {
//
//     changeLock = true;
//     let response = JSON.parse(data) as SendText;
//     if (response.action == 'insert') {
//
//         let text = response.content.reduce(function (e1, e2) {
//             return e1 + '\n' + e2;
//         })
//
//         editor.session.insert(response.positionStart, text);
//
//
//     } else if (response.action == 'remove') {
//         let r = {
//             start: response.positionStart,
//             end: response.positionEnd,
//         } as any;
//
//         editor.session.remove(r);
//
//     }
//     changeLock = false;
//
// });
//
// console.log(socket);
// socket.emit('getText')
