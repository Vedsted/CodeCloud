import { editText } from './editorRef.js'
import { SendText } from '../shared/requestObjects/sendTextObject.js';

let collaboratorNS: any;
let socketToName: Map<any, String>;
function onDisconnect() {
    console.log('i disconnected one client')
}

export function setupSocketServer(server: any) {
    socketToName = new Map([]);
    collaboratorNS = server.of('/collab');
    collaboratorNS.on('connection', (socket: any) => onConnect(socket));

}

function sendText(data: SendText, socket: any) {
    editText(data);
    socket.broadcast.emit('updateText', data)
}

function onConnect(socket: any) {
    console.log('A user connected!');
    socketToName.set(socket.id, 'Nickname');
    socket.on('disconnect', () => onDisconnect());
    socket.on('sendText', (data: SendText) => sendText(data, socket));
    listClients();

}

function listClients() {
    collaboratorNS.clients((error: any, clients: any) => {
        if (error) throw error;
        console.log(clients);
    });
}
