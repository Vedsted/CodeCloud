export class SimpleTextObj {
    // Use this class for long-polling
    public content : string;
    public lastEditTime : number;

    constructor(editorContent:string, lastEditTime:number){
        this.lastEditTime = lastEditTime;
        this.content = editorContent;

    }
}