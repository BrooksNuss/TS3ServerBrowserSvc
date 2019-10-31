import express from 'express';
import {ts3Config} from './config';
import { TeamSpeak } from 'ts3-nodejs-library';
import { setupTSListeners, registerTSEvents } from './socket/socketSetup';
import bodyParser = require('body-parser');
import { TsClientConnectionManager } from './rtc/tsClient/tsClientConnectionManager';
import { ServerBrowserCacheService } from './cache/serverBrowserCache.service';
import { ClientStatusService } from './cache/clientStatus.service';
const path = require('path');
const socketIo = require('socket.io');
const cors = require('cors');
const app = express();
const expressPort = 8080;
const socketPort = 8081;
const fs = require('fs');
const https = require('https');
const privateKey = fs.readFileSync(path.resolve(__dirname, '../../server.key'), 'utf8');
const cert = fs.readFileSync(path.resolve(__dirname, '../../server.crt'), 'utf8');
const httpsCredentials = {key: privateKey, cert};
let ts3: TeamSpeak;
let ts3Ready = false;
const socketConnections: Array<SocketIO.Socket> = [];

app.use(cors());
app.use(bodyParser.json());

app.use('/api/v1', require('./routes/base'));

const httpsServer = https.createServer(httpsCredentials, app);
httpsServer.listen(expressPort, () => {
    console.log( `server started at https://localhost:${ expressPort }` );
});
const socketServer: SocketIO.Server = socketIo(httpsServer);

TeamSpeak.connect(ts3Config).then(ts => {
    ts3 = ts;
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
});

socketServer.on('connection', (socket: any) => {
    socketConnections.push(socket);
    console.log('socket connected:');
    socket.send('Websocket connection ready');
    socket.on('message', (msg: any) => {
        console.log(msg);
    });
});

const rtcApp = new TsClientConnectionManager();
const fileCache = new ServerBrowserCacheService();
const clientStatusService = new ClientStatusService();

export {ts3, app, rtcApp, socketServer, fileCache};
