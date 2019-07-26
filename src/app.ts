import express from 'express';
import 'ts3-nodejs-library';
import {ts3Config} from './config';
import { setupTSListeners, registerTSEvents } from './socket/socketSetup';
import bodyParser = require('body-parser');
const socketIo = require('socket.io');
const TeamSpeak3 = require('ts3-nodejs-library');
const cors = require('cors');
const app = express();
const expressPort = 8080;
const socketPort = 8081;
const fs = require('fs');
const https = require('https');
const privateKey = fs.readFileSync('../server.key', 'utf8');
const cert = fs.readFileSync('../server.crt', 'utf8');
const httpsCredentials = {key: privateKey, cert};
const ts3: TeamSpeak3 = new TeamSpeak3(ts3Config);
let ts3Ready = false;
const socketConnections: Array<SocketIO.Socket> = [];

app.use(cors());
app.use(bodyParser.json());

app.use('/api/v1', require('./routes/base'));

const httpsServer = https.createServer(httpsCredentials, app);
httpsServer.listen(expressPort, () => {
    console.log( `server started at https://localhost:${ expressPort }` );
})
const socketServer = socketIo(httpsServer);

ts3.on('ready', async () => {
    try {
        ts3Ready = true;
        registerTSEvents(ts3);
        setupTSListeners(ts3, socketServer);
    } catch (e) {
        console.log('error');
        console.log(e);
    }
});

ts3.on('error', (err) => {
    console.log('TS3 ERROR');
    console.log(err);
});

socketServer.on('connection', (socket: any) => {
    socketConnections.push(socket);
    console.log('socket connected:');
    socket.send('Websocket connection ready');
    socket.on('message', (msg: any) => {
        console.log(msg);
    });
});

const rtcApp = require('./rtc/rtcApp');

export {ts3, app, rtcApp};
