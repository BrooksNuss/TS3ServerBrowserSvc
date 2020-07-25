import { TeamSpeakServerGroup } from 'ts3-nodejs-library/lib/node/ServerGroup';
import { TeamSpeakChannelGroup } from 'ts3-nodejs-library/lib/node/ChannelGroup';

export interface ClientAvatarCache {
    clientDBId: number;
    avatarGUID: string;
    avatarBuffer: string;
}

export interface GroupIconCache {
    groupId: number;
    iconGUID: string;
    iconBuffer: string;
    groupType?: IconType;
}

export type AwayStatus = 'ACTIVE' | 'INACTIVE' | 'AWAY' | 'OFFLINE';

export interface ClientStatus {
    clientDBId: number;
    status: AwayStatus;
}

export type IconType = 'channel' | 'server';

export type GroupModelType = TeamSpeakServerGroup | TeamSpeakChannelGroup;
