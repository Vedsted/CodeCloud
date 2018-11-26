import * as io from 'socket.io';
import { App } from './app';
import { SendText } from '../shared/requestObjects/sendTextObject';
import { json } from 'body-parser';

export class SocketHandler {
    private collabServer: io.Namespace;
    private app: App;
    private server: io.Server;

    constructor(server: io.Server, app: App) {
        this.server = server;

        this.collabServer = server.of('/collab');
        this.collabServer.on('connection', (socket: io.Socket) => this.onConnect(socket));

        this.app = app;
    }

    private onConnect(socket: io.Socket) {
        console.log('A user connected!');

        socket.on('disconnect', () => this.onDisconnect());

        socket.on('joinRoom', (room: string) => this.onJoinRoom(socket, room));

        socket.on('sendText', (data: string) => this.onSendText(socket, data));

        socket.on('getText', () => this.onGetText(socket));

        this.listClients();
    }

    private onDisconnect() {
        console.log('A Client Disconnected')
    }

    private onJoinRoom(socket: io.Socket, room: string) {
        socket.join(room, () => {
            console.log('socket joined room: ' + this.getSocketRoom(socket)); // [ <socket.id>, 'room 237' ]
            socket.emit('joinedRoom', 'Room Joined Successfully!')
        });
    }

    private onSendText(socket: io.Socket, data: string) {
        socket.to(this.getSocketRoom(socket)).broadcast.emit('updateText', data);
        //socket.broadcast.emit('updateText', data);
        let st = JSON.parse(data) as SendText;
        this.app.editfile(this.getSocketRoom(socket), st);
    }

    private onGetText(socket: io.Socket) {
        this.app
            .getFile(this.getSocketRoom(socket))
            .then(content => {
                socket.emit('receiveText', { data: content })
            });
    }



    private listClients() {
        this.collabServer
            .clients((error: any, clients: any) => {
                if (error) throw error;
                console.log(clients);
            });
    }

    private getSocketRoom(socket: io.Socket): string {
        //https://github.com/socketio/socket.io/blob/master/docs/API.md#socketrooms
        return Object.keys(socket.rooms)[1]; // [ <socket.id>, 'room 237' ]
    }
}
