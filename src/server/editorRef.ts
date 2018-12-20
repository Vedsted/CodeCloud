import { SendText } from '../shared/requestObjects/sendTextObject.js'

let editorContent: string = "";

let lastEditTime: number;

export function editText(data: SendText) {
    let response = data;
    let text = response.content.reduce(function (e1, e2) {
        return e1 + '\n' + e2;
    });
    if (response.action === 'insert') {
        editorContent = insert(text, response);
    } else if (response.action === 'remove') {
        editorContent = remove(text, response);
    }
    lastEditTime = Date.now();

}


function remove(text: string, response: SendText): string {

    let editorContentLines = editorContent.split('\n') as any[];
    let temp: string = "";
    for (let start = response.positionStart.row; start <= response.positionEnd.row; start++) {
        temp += editorContentLines[start];
        editorContentLines[start] = null;
        if (start != response.positionEnd.row) {
            temp += "\n"
        }
    }
    let value = temp.replace(text, "");

    editorContentLines[response.positionStart.row] = value;
    editorContentLines = editorContentLines.filter(function (e1) {
        return e1 != null
    });
    return editorContentLines.reduce(function (e1, e2) {
        return e1 + '\n' + e2;
    });

}
function insert(text: string, response: SendText): string {

    let editorContentLines = editorContent.split('\n');
    let beforeText = editorContentLines[response.positionStart.row].substring(0, response.positionStart.column);
    let afterText = editorContentLines[response.positionStart.row].substring(response.positionStart.column);
    let value = beforeText + text + afterText;
    editorContentLines[response.positionStart.row] = value;

    return editorContentLines.reduce(function (accum, current) {
        return accum + '\n' + current;
    });

}

export function getLastEditTime(): number {
    return lastEditTime;
}
export function getEditorContent(): string {
    return editorContent;
}