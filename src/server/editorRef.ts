import { SendText } from '../shared/requestObjects/sendTextObject.js'
import { Collaborator } from '../shared/requestObjects/collaboratorObject.js' 

let editorContent: string = "";
let collaborators: Map<string, Collaborator> = new Map<string, Collaborator>();

export function addCollaborator(id: string, collaborator: Collaborator) {
    //console.log("adding collab: " + id);
    collaborators.set(id, collaborator);
    //console.log(collaborators);
}

export function removeCollaborator(id: string) {
    collaborators.delete(id);
}

export function getCollaborators(): IterableIterator<[string, Collaborator]> {
    return collaborators.entries();
}

export function setCollaboratorPosition(id: string, position: any) {
    //console.log("retrieving collab: " + id);
    let collaborator = collaborators.get(id);
    //console.log("collaborator: " + collaborator);
    if (collaborator != undefined) {
        collaborator.position = position;
    }
}

export function editText(data: string) {
    let response = JSON.parse(data) as SendText;
    let text = response.content.reduce(function (accumulator, currentValue) {
        return accumulator + '\n' + currentValue;
    });
    if (response.action === 'insert') {
        editorContent = insert(text, response);
    } else if (response.action === 'remove') {
        editorContent = remove(response);
    }

}

/*
* Removes the range specified in the SendText object
* Parts of this function are very similar to the steps in applyDelta() found here:
* https://github.com/ajaxorg/ace/blob/master/lib/ace/apply_delta.js
*/
function remove(response: SendText): string {
    let editorContentLines = editorContent.split('\n') as any[];

    var startRow = response.positionStart.row;
    var startColumn = response.positionStart.column;
    var endRow = response.positionEnd.row;
    var endColumn = response.positionEnd.column;
    var line = editorContentLines[startRow];

    editorContentLines.splice(
        startRow, endRow - startRow + 1,
        line.substring(0, startColumn) + editorContentLines[endRow].substring(endColumn)
    );

    return editorContentLines.reduce(function (accumulator, currentValue) {
        return accumulator + '\n' + currentValue;
    });

}
function insert(text: string, response: SendText): string {

    let editorContentLines = editorContent.split('\n');
    let beforeText = editorContentLines[response.positionStart.row].substring(0, response.positionStart.column);
    let afterText = editorContentLines[response.positionStart.row].substring(response.positionStart.column);
    let value = beforeText + text + afterText;
    editorContentLines[response.positionStart.row] = value;

    return editorContentLines.reduce(function (accumulator, currentValue) {
        return accumulator + '\n' + currentValue;
    });

}

export function getEditorContent(): string {
    return editorContent;
}