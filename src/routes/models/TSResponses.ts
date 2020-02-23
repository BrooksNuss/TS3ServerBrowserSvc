import { TeamSpeakServerGroup } from 'ts3-nodejs-library/lib/node/ServerGroup';
import { TeamSpeakChannelGroup } from 'ts3-nodejs-library/lib/node/ChannelGroup';
import { TeamSpeakChannel } from 'ts3-nodejs-library/lib/node/Channel';

export interface ClientResponse {
    clid: number;
    cid: number;
    databaseId: number;
    nickname: string;
    avatar?: string;
    servergroups: Array<number> | undefined;
    channelGroupId: number | undefined;
}

export interface ServerGroupResponse extends TeamSpeakServerGroup {
    icon: string;
}

export interface ChannelGroupResponse extends TeamSpeakChannelGroup {
    icon: string;
}

export interface ServerBrowserLookupResponse {
    clients: ClientResponse[];
    channels: TeamSpeakChannel[];
    serverGroups: ServerGroupResponse[];
    channelGroups: ChannelGroupResponse[];
}
