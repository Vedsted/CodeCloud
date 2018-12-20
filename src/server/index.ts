import * as express from 'express';
import * as path from 'path';
import * as http from 'http';
import * as socketIO from 'socket.io';
import * as compression from 'compression';

import { SocketHandler } from "./SocketHandler";


const app = express();
//app.use(compression());
app.use(compression({ threshold: 0 }));

let server = new http.Server(app);

const io = socketIO(server);
const socketHandler = new SocketHandler(io);

const port: number = 80;

app.use('/js', express.static(path.join(__dirname, '../../../webcontent/js')));
app.use('/css', express.static(path.join(__dirname, '../../../webcontent/css')));


app.get('/', function (req: express.Request, res: express.Response) {
    res.sendFile(path.join(__dirname, '../../../webcontent/html/index.html'));
});


server.listen(port, function () {
    console.log(`Example app listening on port ${port}!`);
})
