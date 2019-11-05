import { TeamSpeakClient } from 'ts3-nodejs-library/lib/node/Client';
import { TeamSpeakServerGroup } from 'ts3-nodejs-library/lib/node/ServerGroup';
import { TeamSpeakChannelGroup } from 'ts3-nodejs-library/lib/node/ChannelGroup';

export interface ClientResponse extends TeamSpeakClient {
    avatar: string;
}

export interface ServerGroupResponse extends TeamSpeakServerGroup {
    icon: string;
}

export interface ChannelGroupResponse extends TeamSpeakChannelGroup {
    icon: string;
}
