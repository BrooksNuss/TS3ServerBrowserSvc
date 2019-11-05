import express from 'express';
import { ts3 } from '../app';
import { TeamSpeakChannel } from 'ts3-nodejs-library/lib/node/Channel';

const channelRouter = express.Router();

/**
 * Return list of channels
 */
channelRouter.get('/list', async (req, res) => {
    res.send(await getChannelList());
});

export async function getChannelList(): Promise<TeamSpeakChannel[]> {
    return await ts3.channelList({});
}

module.exports = channelRouter;
