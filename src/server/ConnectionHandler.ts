
var io: any;

function listClients() {
    io.clients((error: any, clients: any) => {
        if (error) throw error;
        console.log(clients);
    })
}

function onConnect(socket: any) {
    console.log('A user connected!');
    socket.on('disconnect', disconnect)
    socket.on('sendText',sendText)
    listClients()
    return socket
}

function disconnect() {
    console.log('i disconnected one client')
}

function sendText(data : string){
    console.log('Received =' + data);
    io.emit('updateText', data)
}

export function setupSocketServer(server: any) {
    io = server
    server.on('connection', onConnect)
}