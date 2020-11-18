import express from 'express';
import { ServerBrowserLookupResponse, ChannelResponse, ServerGroupResponse, ChannelGroupResponse, ClientResponse } from '../models/response/TSResponses';
import { serverStateService} from '../app';
import { mapClientToResponse, mapChannelToResponse, mapServerGroupToResponse, mapChannelGroupToResponse } from 'util/ModelMappers';
import { Channel } from 'models/business/Channel';
import { ServerGroup } from 'models/business/ServerGroup';
import { ChannelGroup } from 'models/business/ChannelGroup';
import { Client } from 'models/business/Client';
// import {ChannelRouter} from "./channels";
// import {UserRouter} from "./users";

const router = express.Router();

router.use('/users', require('./users').userRouter);

router.use('/channels', require('./channels').channelRouter);

router.use('/groups', require('./groups').groupRouter);

router.use('/rtc', require('./rtc'));

router.use('/lookup', async (req, res) => {
    // const lookupValues = await Promise.all([getClientList(), getChannelList(), getServerGroupList(), getChannelGroupList()]);
    const clients: ClientResponse[] = [];
    const channels: ChannelResponse[] = [];
    const serverGroups: ServerGroupResponse[] = [];
    const channelGroups: ChannelGroupResponse[] = [];
    serverStateService.clients.forEach((c: Client) => clients.push(mapClientToResponse(c)));
    serverStateService.channels.forEach((c: Channel) => channels.push(mapChannelToResponse(c)));
    serverStateService.serverGroups.forEach((g: ServerGroup) => serverGroups.push(mapServerGroupToResponse(g)));
    serverStateService.channelGroups.forEach((g: ChannelGroup) => channelGroups.push(mapChannelGroupToResponse(g)));
    const response: ServerBrowserLookupResponse = {clients, channels, serverGroups, channelGroups};
    res.type('application/json');
    res.json(response);
});

module.exports = router;
