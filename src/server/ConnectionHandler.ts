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
        console.log('A Client Disconnected')
    }

    private setupSocketServer(server: io.Server) {
        this.socketToName = new Map([]);
        this.collabNameSpaces[0] = server.of('/collab');
        this.collabNameSpaces[0].on('connection', (socket: io.Socket) => this.onConnect(socket));
    }

    private sendText(data: string, socket: io.Socket) {
        editText(data);
        socket.broadcast.emit('updateText', data)
    }

    private receiveText(socket: io.Socket) {
        socket.emit('receiveText', { data: getEditorContent() });
    }

    private onConnect(socket: io.Socket) {
        console.log('A user connected!');
        this.socketToName.set(socket.id, 'Nickname');
        socket.on('disconnect', () => this.onDisconnect());
        socket.on('sendText', (data: string) => this.sendText(data, socket));
        socket.on('getText', () => this.receiveText(socket));
        // () => this.listClients();
    }

    private listClients() {
        this.collabNameSpaces[0].clients((error: any, clients: any) => {
            if (error) throw error;
            console.log(clients);
        });
    }
}
