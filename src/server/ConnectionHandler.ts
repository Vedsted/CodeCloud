
export class ConnectionHandler {
    private collaboratorNS: any;
    private socketToName: Map<any, String>;
    // private static handler : ConnectionHandler;
    //
    // public static getInstance(){
    //     if (this.handler == undefined){
    //         this.handler = new ConnectionHandler();
    //     }
    // }

    constructor(server: any) {
        this.socketToName = new Map([]);
        this.setupSocketServer(server);
        // console.log(this);
    }

    private onDisconnect() {
        console.log('i disconnected one client')
    }

    private setupSocketServer(server: any) {
        this.collaboratorNS = server.of('/collab');
        this.collaboratorNS.on('connection', (socket: any) => this.onConnect(socket));

    }

    private sendText(data: String) {
        console.log('Received =' + data);
        this.collaboratorNS.emit('updateText', data)
    }

    private onConnect(socket: any) {
        console.log('A user connected!');
        this.socketToName.set(socket.id, 'Nickname');
        socket.on('disconnect', () => this.onDisconnect());
        socket.on('sendText',(data: String)=>this.sendText(data));
        () => this.listClients();

    }

    public listClients() {
        this.collaboratorNS.clients((error: any, clients: any) => {
            if (error) throw error;
            console.log(clients);
        })
    }
}
