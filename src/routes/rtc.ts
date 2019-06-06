import express from 'express';
import {rtcApp} from '../app';

const rtcRouter = express.Router();

/**
 * Initiate webrtc connection to server
 */
rtcRouter.post('/connections', (req, res) => {
    try {
        const connection = rtcApp.connectionManager.createConnection().then((conn: any) => {
            res.send(conn);
        });
        console.log(rtcApp);
        console.log(rtcApp.connectionManager);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

rtcRouter.delete('/connections/:id', (req, res) => {
    const {id} = req.params;
    const connection = rtcApp.connectionManager.getConnection(id);
    if (!connection) {
        res.sendStatus(404);
        return;
    }
    res.send(connection);
});

rtcRouter.get('/connections/:id/local-description', (req, res) => {
    const {id} = req.params;
    const connection = rtcApp.connectionManager.getConnection(id);
    if (!connection) {
        res.sendStatus(404);
        return;
    }
    res.send(connection.toJSON().remoteDescription);
});

rtcRouter.get('/connections/:id/remote-description', (req, res) => {
    const {id} = req.params;
    const connection = rtcApp.connectionManager.getConnection(id);
    if (!connection) {
        res.sendStatus(404);
        return;
    }
    try {
        connection.applyAnswer(req.body);
        res.send(connection.toJSON().remoteDescription);
    } catch (error) {
        res.sendStatus(404);
    }
});

module.exports = rtcRouter;
