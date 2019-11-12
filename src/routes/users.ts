import express from 'express';
import { ts3 } from '../app';
import { TeamSpeakClient } from 'ts3-nodejs-library/lib/node/Client';

const userRouter = express.Router();

/**
 * Return list of users
 */
userRouter.get('/list', async (req, res) => {
    res.send(await getClientList());
});

export async function getClientList(): Promise<TeamSpeakClient[]> {
    // client_type of 0 means standard user, not query user.
    // const responseList: ClientResponse[] = [];
    // const promiseList: Promise<string>[] = [];
    // try {
        const clientList = await ts3.clientList({client_type: 0});
        // clientList.forEach(client => {
        //     const promise = fileCache.getClientAvatar(client);
        //     promiseList.push(promise);
        //     const resp = {} as ClientResponse;
        //     Object.assign(resp, client);
        //     promise.then(avatar => {
        //         resp.avatar = avatar;
        //         responseList.push(resp);
        //     }, err => {
        //         responseList.push(resp);
        //     });
        // });
        // await Promise.all(promiseList);
    // } catch (err) {
    //     console.error(err);
    // }
    return clientList;
}

module.exports = {userRouter, getClientList};
