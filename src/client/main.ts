import {SendText} from '../shared/requestObjects/sendTextObject.js';
import {SimpleTextObj} from "../shared/requestObjects/simpleTextObj";
// @ts-ignore
var editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/javascript");


var changeLock = false;
const baseURL = "http://localhost";
var latestEditTime: number = 0;


window.addEventListener('load', () => poll());

editor.session.on('change', function (event: any) {

    if (changeLock) return;
    let data = new SendText(event.action, event.start, event.lines, event.end);
    sendData(data);
})

function sendData(data: SendText) {

    fetch(baseURL + "/sendText", {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify(data)
    });
}


function poll() {
    fetch(baseURL + '/Polling?latestChange=' + latestEditTime)
        .then(res => res.json())
        .then(json => {

            let response = JSON.parse(json) as SimpleTextObj;
            latestEditTime = response.lastEditTime;
            var cursorpos = editor.getCursorPosition(); // Save current cursor position
            changeLock = true;
            editor.session.setValue(response.content);
            editor.selection.moveTo(cursorpos.row, cursorpos.column); // Restore cursor position
            changeLock = false;

        })
        .then(() => setTimeout(poll, 0))
        .catch(rej => {
            console.log("error", rej)
            setTimeout(poll, 2000)
        });
}
