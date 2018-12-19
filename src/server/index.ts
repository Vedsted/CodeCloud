import * as express from 'express';
import * as path from 'path';
import * as http from 'http';
import * as socketIO from 'socket.io';
import * as bodyParser from 'body-parser'
import { ConnectionHandler } from "./ConnectionHandler";
import {editText, getEditorContent, getLastEditTime} from "./editorRef";
import {GetText} from "../shared/requestObjects/getTextObject";




const app = express();
let server = new http.Server(app);
const io = socketIO(server);

const con = new ConnectionHandler(io);



const port: number = 80;
app.use(bodyParser.json())
app.use('/js', express.static(path.join(__dirname, '../../../webcontent/js')));
app.use('/css', express.static(path.join(__dirname, '../../../webcontent/css')));
app.use('/vendors', express.static(path.join(__dirname, '../../../webcontent/vendors')));


app.get('/', function (req: any, res: any) {
    res.sendFile(path.join(__dirname, '../../../webcontent/html/index.html'));
});

app.get('/front', function (req: any, res: any) {
    res.sendFile(path.join(__dirname, '../../../webcontent/html/front.html'));
});

app.post('/editor/editText', function (req: any , res: any){
    editText(req.body);
    // @ts-ignore
    waiting.forEach(res => {
        var getText = new GetText(getEditorContent(),getLastEditTime());
        res.type('json');
        res.status(200).send(JSON.stringify(getText));
    });
    waiting = [];
    res.send('Success');
});

app.get('/editor/getText', function (req: any, res: any){
    if(req.query.latestChange < getLastEditTime()) {
        var getText = new GetText(getEditorContent(),getLastEditTime());
        res.type('json');
        res.status(200).send(JSON.stringify(getText));
    } else {
        res.status(304 ).end();
    }
});

let waiting : any = [];
app.get('/editor/getText/longPolling', function (req: any, res: any){
    if(req.query.latestChange < getLastEditTime()) {
        var getText = new GetText(getEditorContent(),getLastEditTime());
        res.type('json');
        res.status(200).send(JSON.stringify(getText));
    } else {
        waiting.push(res);
    }
});

//API
app.post('/api/createFile', function (req: any, res: any) {
    console.log("Created a new file!");
});



server.listen(port, function () {
    console.log(`Example app listening on port ${port}!`);
})
