import * as express from 'express';
import * as path from 'path';
import * as http from 'http';
import * as bodyParser from 'body-parser'
import { getEditorContent, editText, getModifiedTimeStamp } from './editorRef'
import { SimpleTextObject } from '../shared/requestObjects/simpleTextObject';


const app = express();
let server = new http.Server(app);

let waiting: Map<string, any> = new Map<string, any>(); // Queue of clients waiting for polling response

const port: number = 8080;

app.use(bodyParser.json());
app.use(function(req:any , res:any, next:any) {
    res.header("Access-Control-Allow-Origin", "*"); // Allow other pages to use the API
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-type, Accept");
    next();
});
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

app.get('/api/file', function (req: any, res: any) {
    let simpleTextObject = new SimpleTextObject(getEditorContent(), getModifiedTimeStamp());
    res.json(JSON.stringify(simpleTextObject));
});

app.patch('/api/sendText', function (req: any, res: any) {
    let clientGuid = req.query.guid;
    editText(req.body);

    // Notify all waiting clients
    waiting.forEach((res: any, key: string) => {
        if (clientGuid != key) {
            let update = new SimpleTextObject(getEditorContent(), getModifiedTimeStamp());
            res.json(JSON.stringify(update));
        }
    });

    // Remove clients in the queue
    for (let key of Array.from(waiting.keys())) {
        if (clientGuid != key) {
            waiting.delete(key);
        }
    }
    res.send('OK');
});

app.get('/api/updateText', function(req: any, res: any) {
    let timestamp = Number.parseInt(req.query.timestamp);
    let clientGuid = req.query.guid;
    
    if (timestamp < getModifiedTimeStamp()) { // new changes for the client?
        let simpleTextObject = new SimpleTextObject(getEditorContent(), getModifiedTimeStamp());
        res.json(JSON.stringify(simpleTextObject));
    } else {
        waiting.set(clientGuid, res);
    }
});


server.listen(port, function () {
    console.log(`Example app listening on port ${port}!`);
})
