import express from 'express';
import { ts3 } from '../app';
import { ClientResponse } from './models/ClientResponse';

const userRouter = express.Router();

/**
 * Return list of users
 */
userRouter.get('/list', (req, res) => {
    // client_type of 0 means standard user, not query user.
    const responseList: ClientResponse[] = [];
    const promiseList: Promise<Buffer>[] = [];
    ts3.clientList({client_type: 0}).then((clientList) => {
        clientList.forEach(client => {
            const promise = client.getAvatar();
            promiseList.push(promise);
            promise.then(avatar => {
                responseList.push({client, avatar});
            }, err => {
                console.error('client avatar error');
            });
        });
        Promise.all(promiseList).then(list => {
            res.send(responseList);
        }, err => {
            res.send(responseList);
        });
    }, err => {
        console.log('client list error');
    });
});

module.exports = userRouter;
