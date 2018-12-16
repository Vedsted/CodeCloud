import { SendText } from '../shared/requestObjects/sendTextObject.js';
import { Collaborator } from '../shared/requestObjects/collaboratorObject.js';
import { stringify } from 'querystring';
import { Session } from 'inspector';

var editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/javascript");

const socket = io('/collab');
let socketID = "";

var changeLock = false;



editor.session.on('change', function (event: any) {

    if (changeLock) return
    console.log(event);
    let request = new SendText(event.action, event.start, event.lines, event.end);
    socket.emit('sendText', JSON.stringify(request));
    console.log("sendText: " + event.lines);
    console.log("sendText (JSON data): " + JSON.stringify(request));
    let cursorPos = getCursorPosition();
    console.log("myCursorPos: " + cursorPos.row + " " + cursorPos.column);
    let collaboratorRequest = new Collaborator(socketID, {row: cursorPos.row, column: cursorPos.column+1});
    socket.emit('setCollaboratorPosition', collaboratorRequest);
})


socket.on('connect', () => {
    socketID = socket.id;
});

socket.on('receiveText', (data: any) => {
    changeLock = true;
    console.log("Receive text data = " + data.data)
    editor.session.setValue(data.data);
    changeLock = false;
});

socket.on('updateText', (data: any) => {

    changeLock = true;
    let response = JSON.parse(data) as SendText;
    if (response.action == 'insert') {

        let text = response.content.reduce(function (accumulator, currentValue) {
            return accumulator + '\n' + currentValue;
        });

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
socket.emit('getText');
socket.emit('getCollaborators');

let collaborators = new Map<string, Collaborator>();

function getCursorPosition(): any {
    let cursor = editor.getCursorPosition();
    return cursor;
}

socket.on('receiveCollaborators', (data: any) => {
    // let response = new Map<string, Collaborator>(JSON.parse(data));
    
    // collaborators = response;

    // // Clear any existing markers in the editor
    // let inFront = true;
    // let markerArray = editor.session.getMarkers(inFront);
    // if (markerArray.array != undefined) {
    //     markerArray.array.forEach((markerID: any) => {
    //         editor.session.removeMarker(markerID);
    //     });;
    // }

    // // Add/update the dynamic marker to the AceEditor
    // collaborators.forEach((collaborator, id) => {
    //     console.log(collaborator.id + " " + collaborator.position.column + " " + collaborator.position.row);
    //     if(collaborator.id != socketID) {
    //         //addCollaboratorMarker(collaborator);
    //     }
    // });
});

socket.on('updateCollaboratorPosition', (data: any) => {
    let response = new Map<string, Collaborator>(JSON.parse(data));
    
    collaborators = response;
    console.log("updateCollaboratorPosition: " + collaborators);
    let Range = ace.require("ace/range").Range;


    // Clear any existing markers in the editor
    let inFront = true;
    let markerArray = editor.session.getMarkers(inFront);
    if (markerArray != undefined) {
        Object.keys(markerArray).forEach(function(key,index) {
            // key: the name of the object key
            // index: the ordinal position of the key within the object
            console.log("remove marker: " + key);
            editor.session.removeMarker(Number.parseInt(key));
        });
    }

    // Add/update the dynamic marker to the AceEditor
    collaborators.forEach((collaborator, id) => {
        console.log(collaborator.id + " " + collaborator.position.row + " " + collaborator.position.column);
        if(collaborator.id != socketID) {
            editor.session.addMarker(new Range(collaborator.position.row, collaborator.position.column, collaborator.position.row, collaborator.position.column+1),
                "MyCursorCssClass", "text", true);
        }
    });
});

function addCollaboratorMarker(collaborator: Collaborator) {   
    // Adds the marker to the session..
    var marker = editor.session.addDynamicMarker({ update: drawAuthInfos }, true);
}

function drawAuthInfos(html: any, markerLayer: any, session: any, config: any) {
    console.log("update dynamicmarker start");

    var bgColor = "#ff0000"; //colorPool[uid];
    var extraStyle = "position:absolute;border-left: 1px solid #ff0000;" + "z-index: 2000";
    var startPos = session.documentToScreenPosition(0); //mysession.documentToScreenPosition(edit.pos);
    
    /*markerLayer.drawSingleLineMarker(html,
        new aceRange(startPos.row, startPos.column, startPos.row, startPos.column + edit.length),
        "", config, 0, extraStyle);*/
        
    markerLayer.drawSingleLineMarker(html,
        new AceAjax.Range(3, 2, 0, 0),
        "", config, 0, extraStyle);

    
    console.log("update dynamicmarker end");
}

// To remove marker:
// session.removeMarker(marker.id);