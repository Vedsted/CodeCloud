import { SendText } from '../shared/requestObjects/sendTextObject.js';
import { SimpleTextObject } from '../shared/requestObjects/simpleTextObject.js'

// @ts-ignore
var editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/javascript");

let changeLock = false;
let latestUpdate: number = Date.now();
let clientGUID: string = uuidv4();

// Poll for updates when the windows has loaded
window.addEventListener("load", () => poll());

editor.session.on('change', function (event: any) {
    if (changeLock) return
    let request = new SendText(event.action, event.start, event.lines, event.end);
    sendText(apiUrl() + "/sendText", request);
});

function sendText(url: string, data: SendText) {
    fetch(url + "?guid=" + clientGUID, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify(data)
    });
}

function poll() {
    // Get the whole file if the editor is empty
    if(editor.session.getValue() === "") { // if empty
        getFile()
        .then(response => {
            let simpleTextObject = JSON.parse(response) as SimpleTextObject;
            latestUpdate = simpleTextObject.timeStamp;
            changeLock = true; // Prevent the editor's change event
            editor.session.setValue(simpleTextObject.content);
            changeLock = false;
        });
    }

    // Polling request
    fetch(apiUrl() + "/updateText?timestamp=" + latestUpdate + "&guid=" + clientGUID)
        .then(response => {
            return response.json();
        })
        .then(json => {
            let update = JSON.parse(json) as SimpleTextObject;
            latestUpdate = update.timeStamp;
            changeLock = true; // Prevent the editor's change event
            var cursorpos = editor.getCursorPosition(); // Save current cursor position
            editor.session.setValue(update.content); // Replace all existing content with the newest
            changeLock = false;
            // @ts-ignore
            editor.selection.moveTo(cursorpos.row, cursorpos.column); // Move the cursor to the previous location
        })
        .then(() => {
            setTimeout(poll, 0); // Start polling immediately, after the previous response
        })
        .catch(error => {
            console.log(error); // An error, like network error occured
            setTimeout(poll, 3000); // Start polling after 3 sec.
        });
}

async function getFile() {
    return fetch(apiUrl() + "/file", {
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        }
    })
    .then(response =>  {
        return response.json();
    });
}

function apiUrl() {
    return "http://codecloud.local:8080/api";
}

// Method for generating RFC4122 compliant GUID
// https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
function uuidv4() {
    // @ts-ignore
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, (c: any) =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    )
}