import { ConnectionHandler } from "./ConnectionHandler";


const express = require('express');
const path = require('path');
const app = express()
const http = require('http').Server(app);
const io = require('socket.io')(http);

// ConnectionHandler.setupSocketServer(io);


const con = new ConnectionHandler(io);



const port: number = 80;

app.use('/js', express.static(path.join(__dirname, '../../webcontent/js')));
app.use('/css', express.static(path.join(__dirname, '../../webcontent/css')));
app.use('/vendors', express.static(path.join(__dirname, '../../webcontent/vendors')));


app.get('/', function (req: any, res: any) {
    res.sendFile(path.join(__dirname, '../../webcontent/html/index.html'));
});
app.get('/front', function (req: any, res: any) {
    res.sendFile(path.join(__dirname, '../../webcontent/html/front.html'));
});

//API
app.post('/api/createFile', function (req : any, res: any){
    console.log("Created a new file!");
});



http.listen(port, function () {
    console.log(`Example app listening on port ${port}!`);
})
