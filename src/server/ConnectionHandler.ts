import { editText, getEditorContent } from './editorRef.js'
let io: any;
let collaboratorNS: any;
let socketToName: Map<any, string>;
function onDisconnect() {
    console.log('A Client Disconnected')
}

export function setupSocketServer(server: any) {
    io = server;
    socketToName = new Map([]);
    collaboratorNS = server.of('/collab');
    collaboratorNS.on('connection', function (socket: any) {
        onConnect(socket);
    });
}

function sendText(data: string, socket: any) {
    editText(data);
    socket.broadcast.emit('updateText', data)
}

function onConnect(socket: any) {
    console.log('A user connected!');
    socketToName.set(socket.id, 'Nickname');
    socket.on('disconnect', () => onDisconnect());
    socket.on('sendText', (data: string) => sendText(data, socket));
    socket.on('getText', () => {
        socket.emit('receiveText', { data: getEditorContent() })
    });
    listClients();
}

function listClients() {
    collaboratorNS.clients((error: any, clients: any) => {
        if (error) throw error;
        console.log(clients);
    });
}
