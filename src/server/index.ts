import * as express from 'express';
import * as path from 'path';
import * as http from 'http';
import * as socketIO from 'socket.io';
import {Request, Response} from "express";

import { ConnectionHandler } from "./ConnectionHandler";

import * as editor from "./editorRef";
import {GetTextobj} from "../shared/requestObjects/GetTextObj";
import * as bodyParser from 'body-parser'

const app = express()
let server = new http.Server(app);
const io = socketIO(server);


//const con = new ConnectionHandler(io);

const port: number = 80;

let waiting : any = [];

app.use(bodyParser.json());
app.use('/js', express.static(path.join(__dirname, '../../../webcontent/js')));
app.use('/css', express.static(path.join(__dirname, '../../../webcontent/css')));
app.use('/vendors', express.static(path.join(__dirname, '../../../webcontent/vendors')));


app.get('/', function (req: any, res: any) {
    res.sendFile(path.join(__dirname, '../../../webcontent/html/index.html'));
});

app.get('/getText', function (req: Request, res: Response){
    if(req.query.latestChange < editor.getLastEditTime()) {
        var getText:  GetTextobj = new GetTextobj(editor.getEditorContent(),editor.getLastEditTime());
        res.type('json');
        res.status(200).send(JSON.stringify(getText));
    } else {
        res.status(304 ).end();
    }
});



app.post('/editText', function (req: Request , res: Response){
    editor.editText(req.body);

    waiting.forEach((res: Response) => {
        var getText: GetTextobj = new GetTextobj(editor.getEditorContent(),editor.getLastEditTime());
        res.type('json');
        res.status(200).send(JSON.stringify(getText));
    });
    waiting = []; // Reset Waiting Clients
    res.send('Successful Edit Text');
});


app.get('/Polling', function (req: Request, res: Response){
    if(req.query.latestChange < editor.getLastEditTime()) {
        var getText: GetTextobj = new GetTextobj(editor.getEditorContent(),editor.getLastEditTime());
        res.type('json');
        res.status(200).send(JSON.stringify(getText));
    } else {
        waiting.push(res);
    }
});


server.listen(port, function () {
    console.log(`Example app listening on port ${port}!`);
})
