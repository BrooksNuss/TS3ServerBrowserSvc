import express from 'express';
import { ts3, fileCache } from '../app';
import { ClientResponse } from './models/TSResponses';

const userRouter = express.Router();

/**
 * Return list of users
 */
userRouter.get('/list', async (req, res) => {
    res.send(await getClientList());
});

export async function getClientList(): Promise<ClientResponse[]> {
    // client_type of 0 means standard user, not query user.
    const responseList: ClientResponse[] = [];
    const promiseList: Promise<string>[] = [];
    try {
        const clientList = await ts3.clientList({client_type: 0});
        clientList.forEach(client => {
            const promise = fileCache.getAvatar(client);
            promiseList.push(promise);
            const resp = {} as ClientResponse;
            Object.assign(resp, client);
            promise.then(avatar => {
                resp.avatar = avatar;
                responseList.push(resp);
            }, err => {
                responseList.push(resp);
            });
        });
        await Promise.all(promiseList);
    } catch (err) {
        console.error(err);
    }
    return responseList;
}

module.exports = userRouter;
