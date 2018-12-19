export class GetText {
    public editorContent : string;
    public lastEditTime : number;
    constructor(editorContent:string, lastEditTime:number){
        this.editorContent = editorContent;
        this.lastEditTime = lastEditTime;
    }
}