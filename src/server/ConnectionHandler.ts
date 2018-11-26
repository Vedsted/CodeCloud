import { editText, getEditorContent, addCollaborator, removeCollaborator, getCollaborators, setCollaboratorPosition } from './editorRef.js'
import { Collaborator } from '../shared/requestObjects/collaboratorObject.js';
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
        console.log('A Client Disconnected');
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


    private onConnect(socket: io.Socket) {
        console.log('A user connected! ID: ' + socket.id);
        this.socketToName.set(socket.id, 'Nickname');
        socket.on('disconnect', () => this.onDisconnect());
        socket.on('sendText', (data: string) => this.sendText(data, socket));
        socket.on('getText', () => {
            socket.emit('receiveText', { data: getEditorContent() })
        });

        /*
        * Collaborator feature
        */
        let collaboratorCursorPos = { row: 0, column: 0 };
        addCollaborator(socket.id, new Collaborator(socket.id, collaboratorCursorPos));
        socket.on('getCollaborators', () => {
            console.log(JSON.stringify(Array.from(getCollaborators())));
            socket.emit('receiveCollaborators', JSON.stringify(Array.from(getCollaborators())));
        });
        socket.on('setCollaboratorPosition', (data: any) => {
            console.log("setCollaboratorPosition: " + data);
            setCollaboratorPosition(data.id, data.position);
            socket.broadcast.emit('updateCollaboratorPosition', JSON.stringify(Array.from(getCollaborators())));
        });

        () => this.listClients();
    }

    private listClients() {
        this.collabNameSpaces[0].clients((error: any, clients: any) => {
            if (error) throw error;
            console.log(clients);
        });
    }
}
