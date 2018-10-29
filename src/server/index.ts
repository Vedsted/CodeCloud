const express = require('express');
const path = require('path');
const app = express()
const http = require('http').Server(app);
const socket = require('socket.io')(http);

const port: number = 8080;
app.use('/client', express.static(path.join(__dirname, '../client')));
app.use('/css', express.static(path.join(__dirname, '../../webcontent/css')));

app.get('/', function (req: any, res: any) {
    res.sendFile(path.join(__dirname, '../../webcontent/html/index.html'));
});


http.listen(port, function () {
    console.log(`Example app listening on port ${port}!`);
})