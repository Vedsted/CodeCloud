const express = require('express');
const socket = require('socketio');
const path = require('path');
const app = express()

const port: number = 8080;

app.get('/', function (req: any, res: any) {
    res.sendFile(path.join(__dirname, '../../webcontent/html/index.html'));
});

app.listen(port, function () {
    console.log(`Example app listening on port ${port}!`);
})