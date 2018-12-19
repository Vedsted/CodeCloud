import { editText, getEditorContent } from './editorRef.js';
import * as io from 'socket.io';


export class ConnectionHandler {
    private collabNameSpaces: io.Namespace[];
    private socketToName: Map<any, string>;

    constructor(server: io.Server) {
        this.socketToName = new Map([]);
        this.collabNameSpaces = [];
        this.setupSocketServer(server);
    }

    private onDisconnect() {

    }

    private setupSocketServer(server: io.Server) {
        this.socketToName = new Map([]);
        this.collabNameSpaces[0] = server.of('/collab');
        this.collabNameSpaces[0].on('connection', (socket: io.Socket) => this.onConnect(socket));
    }

    private sendText(data: string, socket: io.Socket) {
        editText(JSON.parse(data));
        socket.broadcast.emit('updateText', data)
    }

    private receiveText(socket: io.Socket) {
        socket.emit('receiveText', { data: getEditorContent() });
    }

    private onConnect(socket: io.Socket) {
        this.socketToName.set(socket.id, 'Nickname');
        socket.on('disconnect', () => this.onDisconnect());
        socket.on('sendText', (data: string) => this.sendText(data, socket));
        socket.on('getText', () => this.receiveText(socket));
    }

}
