import { DatabaseHandler, IFile } from './databaseHandler';
import { StringManip } from './stringManip';
import { SendText } from '../shared/requestObjects/sendTextObject';

export class App {

    private databaseHandler: DatabaseHandler;
    private stringManip: StringManip;

    constructor(databaseHandler: DatabaseHandler) {
        this.databaseHandler = databaseHandler;
        this.stringManip = new StringManip();
    }

    editfile(fileName: string, sendTextObject: SendText) {
        this.databaseHandler
            .getFile(fileName)
            .then(file => {

                let editedContent = this.stringManip.editText(sendTextObject, file.content);

                this.databaseHandler
                    .updateFile({
                        name: file.name,
                        content: editedContent
                    })
            })
    }

    getFile(file: string): Promise<string> {
        return this.databaseHandler
            .getFile(file)
            .then(file => {
                return file.content;
            })
            ;
    }

    createFile(fileName: string): Promise<{ name: string, content: string }> {
        return this.databaseHandler
            .createFile(fileName)
            .then(file => {
                return {
                    name: file.name,
                    content: file.content
                };
            })
    }

}