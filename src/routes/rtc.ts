import express from 'express';
import {rtcApp} from '../app';

const rtcRouter = express.Router();

/**
 * Initiate webrtc connection to server
 */
rtcRouter.post('/connections', (req, res) => {
    try {
        rtcApp.createConnection().then((offer) => {
            res.send(offer);
        }, err => {
            console.log(err);
        });
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

// remove?
rtcRouter.delete('/connections/:id', (req, res) => {
    const {id} = req.params;
    // const connection = rtcApp.getConnection(id);
    const success = rtcApp.deleteConnection(id);
    if (!success) {
        res.sendStatus(404);
        return;
    }
    res.send(success);
});

// rtcRouter.get('/connections/:id/local-description', (req, res) => {
//     const {id} = req.params;
//     const connection = rtcApp.getConnection(id);
//     if (!connection) {
//         res.sendStatus(404);
//         return;
//     }
//     res.send(connection.toJSON().remoteDescription);
// });

rtcRouter.post('/connections/:id/remote-description', (req, res) => {
    const {id} = req.params;
    const connection = rtcApp.getConnection(id);
    if (!connection) {
        res.sendStatus(404);
        return;
    }
    try {
        rtcApp.applyAnswer(connection, req.body).then(answer => {
            res.send(answer);
        });
    } catch (error) {
        res.sendStatus(500);
    }
});

module.exports = rtcRouter;
