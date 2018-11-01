
export class ConnectionHandler {

    private server : any;


    constructor(socketSever: any) {
        this.server = socketSever;
        this.setupEvents();

    }


    private setupEvents() {
        this.server.on('connection', function (socket: any) {
            console.log('A user connected!');

            socket.on('disconnect',function () {
                console.log('A user disconnected!');
            })
        });


    }

    public listClients(){
        for (const client of this.server.sockets.clients()) {

            console.log(client.id);
        }
    }
}