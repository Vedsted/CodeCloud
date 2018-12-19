import { SendText } from '../shared/requestObjects/sendTextObject.js';
import {GetText} from "../shared/requestObjects/getTextObject";

// @ts-ignore
var editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/javascript");



const baseurl = 'http://104.248.254.222';
var changeLock = false;
var polling = false;
var longpolling = true;
var useSockets = false;

if(polling || longpolling) {
    editor.session.on('change', function (event: any) {

        if (changeLock) return
        let request = new SendText(event.action, event.start, event.lines, event.end);
        var ajaxRequest = new XMLHttpRequest();
        ajaxRequest.open("POST", baseurl + '/editor/editText');
        ajaxRequest.setRequestHeader('Content-Type', 'application/json');
        ajaxRequest.send(JSON.stringify(request));
    });
} else if(useSockets){

    // @ts-ignore
    const socket = io('/collab');
    socket.on('receiveText', (data: any) => {
        changeLock = true;
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
    editor.session.on('change', function (event: any) {
        if (changeLock) return
        console.log(event);
        let request = new SendText(event.action, event.start, event.lines, event.end);
        socket.emit('sendText', JSON.stringify(request));
    });
    socket.emit('getText')
}

var latestEditTime : number = 0;
if(longpolling && !polling){
    window.addEventListener('load', () => longpoll());
}else if(!longpolling && polling) {
    window.addEventListener('load', () => poll());
}
function longpoll(){
    fetch(baseurl + '/editor/getText/longPolling?latestChange=' + latestEditTime)
        .then(res =>res.json())
        .then(json => {
            changeLock = true;

            if (json != '') {
                let response = json as GetText;
                latestEditTime = response.lastEditTime;
                var cursorpos = editor.getCursorPosition();
                editor.session.setValue(response.editorContent);
                editor.selection.moveTo(cursorpos.row, cursorpos.column);
                changeLock = false;
            }
        })
        .then(()=>setTimeout(longpoll,0))
        .catch(rej => console.log("Error: ",rej));
}


function poll(){
    var ajaxRequest = new XMLHttpRequest();
    ajaxRequest.open("GET", baseurl + '/editor/getText?latestChange=' + latestEditTime);
    ajaxRequest.send()

    ajaxRequest.onreadystatechange=function(){
        if(this.status == 200){
           changeLock = true;
           if(ajaxRequest.responseText != '') {
               let response = JSON.parse(ajaxRequest.responseText) as GetText;
               latestEditTime = response.lastEditTime;
               var cursorpos = editor.getCursorPosition();
               editor.session.setValue(response.editorContent);
               editor.selection.moveTo(cursorpos.row, cursorpos.column);
               changeLock = false;
           }
        }
        else{
            console.log("No update to text")
        }
    }
    setTimeout(poll,5000);
}



