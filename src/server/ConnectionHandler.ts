import { editText, getEditorContent, addCollaborator, removeCollaborator, getCollaborators, setCollaboratorPosition } from './editorRef.js'
import { Collaborator } from '../shared/requestObjects/collaboratorObject.js';

export class ConnectionHandler {
    private collaboratorNS: any;
    private socketToName: Map<any, string>;

    constructor(server: any) {
        this.socketToName = new Map([]);
        this.setupSocketServer(server);
    }

    private onDisconnect() {
        console.log('A Client Disconnected');
    }

    private setupSocketServer(server: any) {
        this.socketToName = new Map([]);
        this.collaboratorNS = server.of('/collab');
        this.collaboratorNS.on('connection', (socket: any) => this.onConnect(socket));
    }

    private sendText(data: string, socket: any) {
        editText(data);
        socket.broadcast.emit('updateText', data)
    }

    private onConnect(socket: any) {
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
        this.collaboratorNS.clients((error: any, clients: any) => {
            if (error) throw error;
            console.log(clients);
        });
    }
}
