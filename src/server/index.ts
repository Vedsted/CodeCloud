import * as express from 'express';
import * as path from 'path';
import * as http from 'http';
import * as bodyParser from 'body-parser'
import { getEditorContent, editText, getChangeBuffer } from './editorRef'
import { SendText } from '../shared/requestObjects/sendTextObject';


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
    res.send(getEditorContent());
});

app.patch('/api/sendText', function (req: any, res: any) {
    let clientGuid = req.query.guid;
    editText(req.body);
    res.send('OK');

    // Notify all waiting clients
    waiting.forEach((res: any, key: string) => {
        //console.log("clientguid:" + clientGuid + " key: " + key);
        if (clientGuid != key) {
            //console.log("New SendText arrived, notifying");
            //console.log(JSON.stringify(req.body));
            let updateArray: SendText[] = []; // Expected JSON format is an array of SendText
            updateArray.push(req.body);
            res.json(JSON.stringify(updateArray));
        }
    });

    // Remove clients in the queue
    for (let key of Array.from(waiting.keys())) {
        if (clientGuid != key) {
            waiting.delete(key);
        }
    }
    //waiting = [];
});

app.get('/api/updateText', function(req: any, res: any) {
    let timestamp = Number.parseInt(req.query.timestamp);
    let clientGuid = req.query.guid;
    
    if (getChangeBuffer(timestamp).length > 0) { // new changes for the client?
        res.json(JSON.stringify(getChangeBuffer(timestamp)));
    } else {
        waiting.set(clientGuid, res);
    }
});

app.get('/api/changeBuffer', function(req: any, res: any) {
    let timestamp = Number.parseInt(req.query.timestamp);
    
    if (getChangeBuffer(timestamp).length > 0) {
        res.json(JSON.stringify(getChangeBuffer(timestamp)));
    }
});


server.listen(port, function () {
    console.log(`Example app listening on port ${port}!`);
})
