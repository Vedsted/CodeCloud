export class SendText {

    public action: string;
    public positionStart: { row: number, column: number };
    public content: string[];
    public positionEnd: { row: number, column: number };

    constructor(type: string,
        positionStart: { row: number, column: number },
        content: string[],
        positionEnd: { row: number, column: number }) {

        this.action = type;
        this.positionStart = positionStart;
        this.content = content;
        this.positionEnd = positionEnd;
    }
}