import express from 'express';
import { ts3, fileCache } from '../app';
import { TeamSpeakClient } from 'ts3-nodejs-library/lib/node/Client';
import { ClientResponse } from './models/TSResponses';
import { ClientAvatarCache } from '../cache/models/AvatarCacheModel';

const userRouter = express.Router();

/**
 * Return list of users
 */
userRouter.get('/list', async (req, res) => {
    res.send(await getClientList());
});

// export async function getClientList(): Promise<ClientResponse[]> {
//     // client_type of 0 means standard user, not query user.
//     const responseList: ClientResponse[] = [];
//     const promiseList: Promise<string>[] = [];
//     try {
//         const clientList = await ts3.clientList({client_type: 0});
//         clientList.forEach(client => {
//             const promise = fileCache.getAvatar(client);
//             promiseList.push(promise);
//             const resp: ClientResponse = mapClientToResponse(client);
//             promise.then(avatar => {
//                 resp.avatar = avatar;
//                 responseList.push(resp);
//             }, err => {
//                 responseList.push(resp);
//             });
//         });
//         await Promise.all(promiseList);
//     } catch (err) {
//         console.error(err);
userRouter.get('/avatar', async (req, res) => {
    const responseList: ClientAvatarCache[] = [];
    const promiseList: Promise<ClientAvatarCache | undefined>[] = [];
    for (const client of req.body.clients) {
        const promise = getClientAvatar(parseInt(client));
        promiseList.push(promise);
        const avatar = await promise;
        if (avatar) {
            responseList.push(avatar);
        }
    }
    await Promise.all(promiseList);
    res.send(responseList);
});

export async function getClientList(): Promise<TeamSpeakClient[]> {
    // client_type of 0 means standard user, not query user.
    const clientList = await ts3.clientList({client_type: 0});
    clientList.forEach(client => {
        const resp = {} as ClientResponse;
        Object.assign(resp, client);
        const avatar = fileCache.getCachedAvatar(client.databaseId);
        if (avatar) {
            resp.avatarGUID = avatar.avatarGUID;
        }
    });
    return clientList;
}

export async function getClientAvatar(clientDBId: number): Promise<ClientAvatarCache | undefined> {
    return await fileCache.getAvatarByClientDBId(clientDBId);
}

function mapClientToResponse(client: TeamSpeakClient): ClientResponse {
    const {clid, cid, databaseId, nickname, servergroups, channelGroupId} = client;
    return {clid, cid, databaseId, nickname, servergroups, channelGroupId};
}

module.exports = {userRouter, getClientList};
