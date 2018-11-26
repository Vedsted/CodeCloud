import * as express from 'express';
import * as path from 'path';
import * as http from 'http';
import * as socketIO from 'socket.io';

import { ConnectionHandler } from "./ConnectionHandler";


const app = express();
let server = new http.Server(app);
const io = socketIO(server);

const con = new ConnectionHandler(io);



const port: number = 8080;

app.use('/js', express.static(path.join(__dirname, '../../../webcontent/js')));
app.use('/css', express.static(path.join(__dirname, '../../../webcontent/css')));
app.use('/vendors', express.static(path.join(__dirname, '../../../webcontent/vendors')));


app.get('/', function (req: any, res: any) {
    res.sendFile(path.join(__dirname, '../../../webcontent/html/index.html'));
});

app.get('/front', function (req: any, res: any) {
    res.sendFile(path.join(__dirname, '../../../webcontent/html/front.html'));
});

//API
app.post('/api/createFile', function (req: any, res: any) {
    console.log("Created a new file!");
});



server.listen(port, function () {
    console.log(`Example app listening on port ${port}!`);
})
