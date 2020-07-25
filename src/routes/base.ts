import express from 'express';
import { ServerBrowserLookupResponse, ChannelResponse, ServerGroupResponse, ChannelGroupResponse, ClientResponse } from '../models/response/TSResponses';
import { serverStateService} from '../app';
import { mapClientToResponse, mapChannelToResponse, mapServerGroupToResponse, mapChannelGroupToResponse } from 'util/ModelMappers';
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
    serverStateService.clients.forEach(c => clients.push(mapClientToResponse(c)));
    serverStateService.channels.forEach(c => channels.push(mapChannelToResponse(c)));
    serverStateService.serverGroups.forEach(g => serverGroups.push(mapServerGroupToResponse(g)));
    serverStateService.channelGroups.forEach(g => channelGroups.push(mapChannelGroupToResponse(g)));
    const response: ServerBrowserLookupResponse = {clients, channels, serverGroups, channelGroups};
    res.type('application/json');
    res.json(response);
});

module.exports = router;
