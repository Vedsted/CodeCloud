export class GetTextobj {
    // Use this class for long-polling
    public content : string;
    public lastEditTime : number;

    constructor(editorContent:string, lastEditTime:number){
        this.lastEditTime = lastEditTime;
        this.content = editorContent;

    }

    public getContent(){
        return this.content;
    }

    public getLastEditTime(){
        return this.lastEditTime;
    }
}