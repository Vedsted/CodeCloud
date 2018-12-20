export class SimpleTextObject {
    public content: string;
    public timeStamp: number = -1;

    constructor(content: string, timeStamp: number) {
        this.content = content;
        this.timeStamp = timeStamp;
    }
}