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

export async function getClientList(): Promise<ClientResponse[]> {
    // client_type of 0 means standard user, not query user.
    const responseList: ClientResponse[] = [];
    const promiseList: Promise<ClientAvatarCache | undefined>[] = [];
    try {
        const clientList = await ts3.clientList({client_type: 0});
        clientList.forEach(client => {
            const promise = fileCache.getAvatarByClientDBId(client.databaseId);
            const resp: ClientResponse = mapClientToResponse(client);
            promiseList.push(promise);
            promise.then(avatar => {
                if (avatar) {
                    resp.avatarGUID = avatar.avatarGUID;
                }
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

function mapClientToResponse(client: TeamSpeakClient): ClientResponse {
    const {clid, cid, databaseId, nickname, servergroups, channelGroupId} = client;
    return {clid, cid, databaseId, nickname, servergroups, channelGroupId};
}

module.exports = {userRouter, getClientList};
