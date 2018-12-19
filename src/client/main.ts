import { SendText } from '../shared/requestObjects/sendTextObject.js';

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
    //console.log(event);
    let request = new SendText(event.action, event.start, event.lines, event.end);
    sendText(apiUrl() + "/sendText", request);
    //console.log("sendText: " + event.lines);
    //console.log("sendText (JSON data): " + JSON.stringify(request));
});

function sendText(url: string, data: SendText) {
    //console.log("sending text...");
    data.timeStamp = Date.now();
    fetch(url + "?guid=" + clientGUID, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify(data)
    });
    //.then(response => //console.log("sendText response: " + response.status));
}

function poll() {

    if(editor.session.getValue() === "") { // if empty
        getFile()
        .then(text => {
            changeLock = true; // Prevent the editor's change event
            editor.session.setValue(text)
            changeLock = false;
        });
    }

    fetch(apiUrl() + "/updateText?timestamp=" + latestUpdate + "&guid=" + clientGUID)
        .then(response => {
            return response.json();
        })
        .then(json => {
            //console.log(json);
            let updates = JSON.parse(json) as SendText[];
            //console.log(updates);
            updates.forEach(element => {
                updateText(element);
                latestUpdate = element.timeStamp;
            });
        })
        .then(() => {
            setTimeout(poll, 0);
        })
        .catch(error => {
            //console.log(error)
            setTimeout(poll, 3000);
        });
}

async function getFile() {
    return fetch(apiUrl() + "/file", {
        headers: {
            "Content-Type": "application/text; charset=utf-8"
        }
    })
    .then(response =>  {
        return response.text();
    });
}

function updateText(data: SendText) {
    changeLock = true;
    //let response = JSON.parse(data) as SendText;
    if (data.action == 'insert') {

        let text = data.content.reduce(function (accumulator, currentValue) {
            return accumulator + '\n' + currentValue;
        });

        editor.session.insert(data.positionStart, text);


    } else if (data.action == 'remove') {
        let r = {
            start: data.positionStart,
            end: data.positionEnd,
        } as any;

        editor.session.remove(r);

    }
    changeLock = false;
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