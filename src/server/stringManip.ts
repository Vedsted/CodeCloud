import { SendText } from '../shared/requestObjects/sendTextObject.js'

export class StringManip {


    editText(st: SendText, file: string) {

        if (st.action === 'insert') {
            return this.insert(st, file);
        } else if (st.action === 'remove') {
            return this.remove(st, file);
        }

        return file;
    }


    private remove(sendText: SendText, file: string): string {
        let text = this.reduceLines(sendText.content);

        let editorContentLines = file.split('\n') as any[];
        let temp: string = "";
        for (let start = sendText.positionStart.row; start <= sendText.positionEnd.row; start++) {
            temp += editorContentLines[start];
            editorContentLines[start] = null;
            if (start != sendText.positionEnd.row) {
                temp += "\n"
            }
        }
        let value = temp.replace(text, "");

        editorContentLines[sendText.positionStart.row] = value;
        editorContentLines = editorContentLines.filter(function (e1) {
            return e1 != null
        });

        return this.reduceLines(editorContentLines);

    }


    private insert(response: SendText, file: string): string {
        let text = this.reduceLines(response.content);

        let editorContentLines = file.split('\n');
        let beforeText = editorContentLines[response.positionStart.row].substring(0, response.positionStart.column);
        let afterText = editorContentLines[response.positionStart.row].substring(response.positionStart.column);
        let value = beforeText + text + afterText;
        editorContentLines[response.positionStart.row] = value;

        return this.reduceLines(editorContentLines);

    }


    private reduceLines(strings: string[]): string {
        return strings.reduce(function (e1, e2) {
            return e1 + '\n' + e2;
        });
    }

}