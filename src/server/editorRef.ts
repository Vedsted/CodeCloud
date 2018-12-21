import { SendText } from '../shared/requestObjects/sendTextObject.js'

let editorContent: string = "";
let modifiedTimeStamp: number;

export function editText(data: SendText) {
    let response = data;
    let text = response.content.reduce(function (accumulator, currentValue) {
        return accumulator + '\n' + currentValue;
    });
    if (response.action === 'insert') {
        editorContent = insert(text, response);
    } else if (response.action === 'remove') {
        editorContent = remove(response);
    }
    let timestamp = Date.now();
    modifiedTimeStamp = timestamp;
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

export function getModifiedTimeStamp(): number {
    return modifiedTimeStamp;
}