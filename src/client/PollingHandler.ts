import {GetTextobj} from "../shared/requestObjects/GetTextObj";
import {SendText} from "../shared/requestObjects/sendTextObject";

export class PollingHandler {
    private latestEditTime: number = 0;
    private baseURL = "http://localhost";
    private editor: any;

    private changeLock = false;

    constructor(editor: any){
        this.editor = editor;
    }

    public onChange(event: any){
        if (this.changeLock) return
        let request = new SendText(event.action, event.start, event.lines, event.end);
        var ajaxRequest = new XMLHttpRequest();
        ajaxRequest.open("POST", this.baseURL + '/editText');
        ajaxRequest.setRequestHeader('Content-Type', 'application/json');
        ajaxRequest.send(JSON.stringify(request));
    }

    public longPoll(){
        fetch(this.baseURL + '/Polling?latestChange=' + this.latestEditTime)
            .then(res =>res.json())
            .then(json => {
                this.changeLock = true;
                console.log(json);
                if (json != '') {
                    let response = json as GetTextobj;
                    this.latestEditTime = response.lastEditTime;
                    var cursorpos = this.editor.getCursorPosition();
                    this.editor.session.setValue(response.content);
                    this.editor.selection.moveTo(cursorpos.row, cursorpos.column);
                    this.changeLock = false;
                }
            })
            .then(()=>setTimeout(()=>this.longPoll,0))
            .catch(rej => console.log("Error: ", rej));
    }
}