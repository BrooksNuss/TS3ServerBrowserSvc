import express from 'express';
import { getChannelList } from './channels';
import { getServerGroupList, getChannelGroupList } from './groups';
import { getClientList } from './users';
import { ServerBrowserLookupResponse } from './models/TSResponses';
// import {ChannelRouter} from "./channels";
// import {UserRouter} from "./users";

const router = express.Router();

router.use('/users', require('./users').userRouter);

router.use('/channels', require('./channels').channelRouter);

router.use('/groups', require('./groups').groupRouter);

router.use('/rtc', require('./rtc'));

router.use('/lookup', async (req, res) => {
    const lookupValues = await Promise.all([getClientList(), getChannelList(), getServerGroupList(), getChannelGroupList()]);
    const response: ServerBrowserLookupResponse = {
        clients: lookupValues[0],
        channels: lookupValues[1],
        serverGroups: lookupValues[2],
        channelGroups: lookupValues[3]
    };
    res.type('application/json');
    res.json(response);
});

module.exports = router;
