import express from 'express';
import { ts3 } from '../app';
import { ServerGroupResponse, ChannelGroupResponse } from '../models/response/TSResponses';
import { ServerGroupList } from 'ts3-nodejs-library/lib/types/ResponseTypes';
import { TeamSpeakServerGroup } from 'ts3-nodejs-library/lib/node/ServerGroup';
import { TeamSpeakChannelGroup } from 'ts3-nodejs-library/lib/node/ChannelGroup';

const groupRouter = express.Router();
const serverRouter = express.Router();
const channelRouter = express.Router();

groupRouter.use('/server', serverRouter);
groupRouter.use('/channel', channelRouter);

/**
 * Return all server groups with icons included
 */
serverRouter.get('/list', async (req, res) => {
    res.send(await getServerGroupList());
});

export async function getServerGroupList(): Promise<ServerGroupResponse[]> {
    const promiseList: Promise<Buffer>[] = [];
    const responseList: ServerGroupResponse[] = [];
    try {
        const serverGroupList = await ts3.serverGroupList({type: 1});
        const serverGroupListIcons = serverGroupList.filter(group => group.iconid !== 0);
        const serverGroupListNoIcons = serverGroupList.filter(group => group.iconid === 0);
        serverGroupListIcons.forEach(group => {
            const promise = group.getIcon();
            promiseList.push(promise);
            const resp = mapServerGroupToResponse(group);
            promise.then(icon => {
                resp.icon = icon.toString('base64');
                responseList.push(resp);
            }, err => {
                console.error(err);
                responseList.push(resp);
            });
        });
        serverGroupListNoIcons.forEach(group => {
            responseList.push(mapServerGroupToResponse(group));
        });
        await Promise.all(promiseList);
    } catch (err) {
        console.error(err);
    }
    return responseList;
}

function mapServerGroupToResponse(group: TeamSpeakServerGroup): ServerGroupResponse {
    const {sgid, name, iconid} = group;
    return {sgid, name, iconid};
}

/**
 * Return icon of servergroup
 */
serverRouter.get('/icons/:groupId', (req, res) => {
    ts3.getServerGroupByID(parseInt(req.params.groupId)).then((serverGroup) => {
        if (serverGroup) {
            serverGroup.getIcon().then(icon => {
                res.send(icon);
            });
        }
    });
});

serverRouter.get('/', (req, res) => {
    res.json('/groups/server');
});

/**
 * Return all server groups with icons included
 */
channelRouter.get('/list', async (req, res) => {
    res.send(await getChannelGroupList());
});

export async function getChannelGroupList() {
    const promiseList: Promise<Buffer>[] = [];
    const responseList: ChannelGroupResponse[] = [];
    try {
        const channelGroupList = await ts3.channelGroupList({type: 1});
        const channelGroupListIcons = channelGroupList.filter(group => group.iconid !== 0);
        const channelGroupListNoIcons = channelGroupList.filter(group => group.iconid === 0);
        channelGroupListIcons.forEach(group => {
            const promise = group.getIcon();
            promiseList.push(promise);
            const resp = mapChannelGroupToResponse(group);
            promise.then(icon => {
                resp.icon = icon.toString('base64');
                responseList.push(resp);
            }, err => {
                console.error(err);
                responseList.push(resp);
            });
        });
        channelGroupListNoIcons.forEach(group => {
            responseList.push(mapChannelGroupToResponse(group));
        });
        await Promise.all(promiseList);
    } catch (err) {
        console.error(err);
    }
    return responseList;
}

function mapChannelGroupToResponse(group: TeamSpeakChannelGroup): ChannelGroupResponse {
    const {cgid, name, iconid} = group;
    return {cgid, name, iconid};
}

/**
 * Return icon of channelgroup
 */
channelRouter.get('/icons/:groupId', (req, res) => {
    ts3.getChannelGroupByID(parseInt(req.params.groupId)).then((channelGroup) => {
        if (channelGroup) {
            channelGroup.getIcon().then(icon => {
                res.send(icon);
            });
        }
    });
});

channelRouter.get('/', (req, res) => {
    res.json('/groups/channel');
});

groupRouter.get('/', (req, res) => {
    res.json('/groups');
});

module.exports = {groupRouter, getChannelGroupList, getServerGroupList};
