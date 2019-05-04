import express from "express";
import "ts3-nodejs-library";
import * as socketIo from 'socket.io';
import {ts3Config} from '../credentials'
const TeamSpeak3 = require("ts3-nodejs-library");
const cors = require('cors');
const app = express();
const expressPort = 8080;
const socketPort = 8081;
const ts3: TeamSpeak3 = new TeamSpeak3(ts3Config);
const socket = socketIo.default(socketPort);
let ts3Ready = false;

app.use(cors());

app.use("/api/v1", require("./routes/base"));

// start the Express server
app.listen( expressPort, () => {
    console.log( `server started at http://localhost:${ expressPort }` );
} );

ts3.on("ready", async () => {
    // where all the rest of the magic happens
    try {
        ts3Ready = true;
    } catch (e) {
        console.log("error");
        console.log(e);
    }
});

ts3.on("error", (err) => {
    console.log("TS3 ERROR");
    console.log(err);
});

socket.on('connection', (socket) => {
    console.log('socket connected:');
    console.log(socket);
})

export {ts3};
