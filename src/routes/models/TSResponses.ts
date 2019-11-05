import { TeamSpeakClient } from 'ts3-nodejs-library/lib/node/Client';
import { TeamSpeakServerGroup } from 'ts3-nodejs-library/lib/node/ServerGroup';
import { TeamSpeakChannelGroup } from 'ts3-nodejs-library/lib/node/ChannelGroup';
import { TeamSpeakChannel } from 'ts3-nodejs-library/lib/node/Channel';

export interface ClientResponse extends TeamSpeakClient {
    avatar: string;
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
