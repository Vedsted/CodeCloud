import { editText, getEditorContent } from './editorRef.js'

export class ConnectionHandler {
    private collaboratorNS: any;
    private socketToName: Map<any, string>;

    constructor(server: any) {
        this.socketToName = new Map([]);
        this.setupSocketServer(server);
    }

    private onDisconnect() {
        console.log('A Client Disconnected')
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
        console.log('A user connected!');
        this.socketToName.set(socket.id, 'Nickname');
        socket.on('disconnect', () => this.onDisconnect());
        socket.on('sendText', (data: string) => this.sendText(data, socket));
        socket.on('getText', () => {
            socket.emit('receiveText', { data: getEditorContent() })
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
