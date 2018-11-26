import * as express from 'express';
import * as path from 'path';
import * as http from 'http';
import * as socketIO from 'socket.io';

import { SocketHandler } from "./socketHandler";
import { DatabaseHandler } from './databaseHandler';
import { App } from './app';

const app = express();
let server = new http.Server(app);
const io = socketIO(server);



const databaseHandler = new DatabaseHandler(startServer);


function startServer() {

    const application = new App(databaseHandler);
    const socketHandler = new SocketHandler(io, application);

    const port: number = 80;

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
}