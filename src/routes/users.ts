import express from 'express';
import { ts3, fileCacheService } from '../app';
import { ClientResponse, AvatarListResponse } from '../models/response/TSResponses';
import { mapClientToResponse } from '../util/ModelMappers';
import { ClientAvatarCache } from 'models/cache/CacheModels';

const userRouter = express.Router();

/**
 * Return list of users
 */
// userRouter.get('/list', async (req, res) => {
//     res.send(await getClientList());
// });

// export async function getClientList(): Promise<ClientResponse[]> {
//     // client_type of 0 means standard user, not query user.
//     const responseList: ClientResponse[] = [];
//     const promiseList: Promise<ClientAvatarCache | undefined>[] = [];
//     try {
//         const clientList = await ts3.clientList({client_type: 0});
//         clientList.forEach(client => {
//             const promise = fileCacheService.getAvatarByClient(client);
//             const resp: ClientResponse = mapClientToResponse(client);
//             promiseList.push(promise);
//             promise.then(avatar => {
//                 if (avatar) {
//                     resp.avatarGUID = avatar.avatarGUID;
//                 }
//                 responseList.push(resp);
//             }, err => {
//                 responseList.push(resp);
//             });
//         });
//         await Promise.all(promiseList);
//     } catch (err) {
//         console.error(err);
//     }
//     return responseList;
// }

userRouter.post('/avatar', async (req, res) => {
    res.send(await getAvatarByClientIds(req.body.clientIds));
});

export async function getAvatarByClientIds(clientIds: Array<number>): Promise<AvatarListResponse> {
    const responseList: ClientAvatarCache[] = [];
    const promiseList: Promise<ClientAvatarCache | undefined>[] = [];
    try {
        clientIds.forEach(clientId => {
            const promise = fileCacheService.getAvatarByClientId(clientId);
            promiseList.push(promise);
            promise.then(avatar => {
                responseList.push(avatar);
            }, err => {
                // responseList.push(avatar);
                console.error(err);
            });
        });
        await Promise.all(promiseList);
    } catch (err) {
        console.error(err);
    }
    return Promise.resolve({avatars: responseList});
}

// function mapClientToResponse(client: TeamSpeakClient): ClientResponse {
//     const {clid, cid, databaseId, nickname, servergroups, channelGroupId} = client;
//     return {clid, cid, databaseId, nickname, servergroups, channelGroupId};
// }

module.exports = {userRouter};
