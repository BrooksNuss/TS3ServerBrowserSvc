import express from 'express';
import 'ts3-nodejs-library';
import * as socketIo from 'socket.io';
import {ts3Config} from './credentials';
import { setupTSListeners, registerTSEvents } from './socket/socketSetup';
import bodyParser = require('body-parser');
const TeamSpeak3 = require('ts3-nodejs-library');
const cors = require('cors');
const app = express();
const expressPort = 8080;
const socketPort = 8081;
const ts3: TeamSpeak3 = new TeamSpeak3(ts3Config);
// const http = require('http').Server(app);
// const socketServer = require('socket.io')(http);
let ts3Ready = false;
const socketConnections: Array<SocketIO.Socket> = [];

app.use(cors());
app.use(bodyParser.json());

app.use('/api/v1', require('./routes/base'));

// start the Express server
const server = app.listen( expressPort, () => {
    console.log( `server started at http://localhost:${ expressPort }` );
} );
const socketServer = socketIo.default(server);

ts3.on('ready', async () => {
    // where all the rest of the magic happens
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

socketServer.on('connection', (socket) => {
    socketConnections.push(socket);
    console.log('socket connected:');
    // console.log(socket);
    socket.send('Websocket connection ready');
    socket.on('message', msg => {
        console.log(msg);
    });
});

const rtcApp = require('./rtc/rtcApp');

export {ts3, app, rtcApp};
