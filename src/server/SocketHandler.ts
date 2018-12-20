import { editText, getEditorContent } from './editorRef.js';
import * as io from 'socket.io';

export class SocketHandler {
    private collabNameSpaces: io.Namespace[];

    constructor(server: io.Server) {
        this.collabNameSpaces = [];
        this.collabNameSpaces[0] = server.of('/collab');
        this.collabNameSpaces[0].on('connection', (socket: io.Socket) => this.onConnect(socket));
    }

    private onConnect(socket: io.Socket) {
        console.log('A user connected!');
        socket.on('disconnect', () => this.onDisconnect());
        socket.on('sendChange', (data: string) => this.emitChange(data, socket));
        socket.on('getDocument', () => this.sendDocument(socket));
        () => this.listClients();
    }
    private onDisconnect() {
        console.log('A Client Disconnected')
    }

    private emitChange(data: string, socket: io.Socket) {
        editText(data);
        socket.broadcast.emit('updateText', data)
    }

    private sendDocument(socket: io.Socket) {
        socket.emit('receiveText', { data: getEditorContent() })
    }


    private listClients() {
        this.collabNameSpaces[0].clients((error: any, clients: any) => {
            if (error) throw error;
            console.log(clients);
        });
    }
}
