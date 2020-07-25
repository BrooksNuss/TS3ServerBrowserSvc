import { TeamSpeakChannel } from 'ts3-nodejs-library/lib/node/Channel';
import { TeamSpeakClient } from 'ts3-nodejs-library/lib/node/Client';
import { Client } from 'models/business/Client';
import { Channel } from 'models/business/Channel';
import { ClientResponse, ChannelResponse, ServerGroupResponse, ChannelGroupResponse } from 'models/response/TSResponses';
import { TeamSpeakServerGroup } from 'ts3-nodejs-library/lib/node/ServerGroup';
import { ServerGroup } from 'models/business/ServerGroup';
import { TeamSpeakChannelGroup } from 'ts3-nodejs-library/lib/node/ChannelGroup';
import { ChannelGroup } from 'models/business/ChannelGroup';

// TS db to business
export function mapTSClientToBusiness(client: TeamSpeakClient): Client {
    const {clid, cid, databaseId, nickname, servergroups, channelGroupId, away: away, idleTime} = client;
    return new Client(clid, cid, databaseId, nickname, servergroups || [], channelGroupId, !!away, idleTime, undefined, undefined);
}

export function mapTSChannelToBusiness(channel: TeamSpeakChannel): Channel {
    const {cid, name, pid, topic, flagPassword} = channel;
    return new Channel(cid, name, pid, topic, undefined, !!flagPassword);
}

export function mapTSServerGroupToBusiness(group: TeamSpeakServerGroup): ServerGroup {
    const {name, iconid, sgid} = group;
    return new ServerGroup(sgid, name, iconid.toString());
}

export function mapTSChannelGroupToBusiness(group: TeamSpeakChannelGroup): ChannelGroup {
    const {name,  iconid, cgid} = group;
    return new ChannelGroup(cgid, name, iconid.toString());
}

// business to response

export function mapClientToResponse(client: Client): ClientResponse {
    const {clid, cid, databaseId, nickname, serverGroupIds, channelGroupId, avatarGuid} = client;
    return {clid, cid, databaseId, nickname, serverGroupIds, channelGroupId, avatarGUID: avatarGuid};
}

export function mapChannelToResponse(channel: Channel): ChannelResponse {
    const {cid, pid, name, description, topic, passworded} = channel;
    return {cid, name, pid, description, topic, passworded};
}

export function mapServerGroupToResponse(group: ServerGroup): ServerGroupResponse {
    const {sgid, name, icon} = group;
    return {sgid, name, icon};
}

export function mapChannelGroupToResponse(group: ChannelGroup): ChannelGroupResponse {
    const {cgid, name, icon} = group;
    return {cgid, name, icon};
}
