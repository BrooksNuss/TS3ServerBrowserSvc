import NodeCache from 'node-cache';
import { serverStateService } from '../app';
import { ClientAvatarCache, GroupIconCache, GroupModelType } from '../models/cache/CacheModels';
import { TeamSpeakClient } from 'ts3-nodejs-library/lib/node/Client';
import { TeamSpeakServerGroup } from 'ts3-nodejs-library/lib/node/ServerGroup';
import { TeamSpeakChannelGroup } from 'ts3-nodejs-library/lib/node/ChannelGroup';
const uuidv4 = require('uuidv4');

export class ServerBrowserCacheService {
    public fileCache: NodeCache;

    constructor() {
        // cache items for 1 day, delete expired items every hour
        this.fileCache = new NodeCache({stdTTL: 86400, checkperiod: 3600});
    }

    getAvatarByClientId(clientId: number): Promise<ClientAvatarCache> {
        const client = serverStateService.dbClients.get(clientId);
        if (client) {
            return this.getAvatarByClient(client);
        } else {
            return Promise.resolve({clientDBId: clientId, avatarGUID: '0', avatarBuffer: ''});
        }
    }

    async getAvatarByClient(client: TeamSpeakClient): Promise<ClientAvatarCache> {
        let avatar = this.getCachedAvatar(client.databaseId);
        if (!avatar || avatar.avatarGUID === '0') {
            avatar = await this.getClientAvatarFromTS(client);
        }
        return Promise.resolve(avatar);
    }

    private getCachedAvatar(clientDBId: number): ClientAvatarCache | undefined {
        const fileName = `client_${clientDBId}_avatar`;
        let avatar = this.fileCache.get<ClientAvatarCache>(fileName);
        if (!avatar) {
            avatar = {clientDBId, avatarBuffer: '', avatarGUID: '0'};
            this.fileCache.set(fileName, avatar);
        }
        return avatar;
    }

    private async getClientAvatarFromTS(client: TeamSpeakClient): Promise<ClientAvatarCache> {
        let avatarBuffer;
        let cacheObject: ClientAvatarCache | undefined;
        if (client) {
            try {
                avatarBuffer = await client.getAvatar();
            } catch (e) {
                console.error('Error getting avatar for client ' + client.nickname);
            }
            if (avatarBuffer) {
                cacheObject = {clientDBId: client.databaseId, avatarGUID: this.createId(), avatarBuffer: avatarBuffer.toString('base64')};
                this.fileCache.set<ClientAvatarCache>(`client_${client.databaseId}_avatar`, cacheObject);
            }
        }
        if (!cacheObject) {
            cacheObject = {clientDBId: client.databaseId, avatarGUID: this.createId(), avatarBuffer: ''};
        }
        return Promise.resolve(cacheObject);
    }

    public async getGroupIconByGroupId(group: GroupModelType, groupType: 'channel' | 'server'): Promise<string | undefined> {
        let icon = this.getCachedIcon(group, groupType);
        if (!icon || icon.iconGUID === '0') {
            icon = await this.getGroupIconFromTS(group, groupType);
        }
        return Promise.resolve(icon ? icon.iconBuffer : '');
    }

    private getCachedIcon(group: GroupModelType, groupType: 'channel' | 'server'): GroupIconCache | undefined {
        const fileName = `${groupType}Group_${group.iconid}_icon`;
        let icon = this.fileCache.get<GroupIconCache>(fileName);
        if (!icon) {
            icon = {groupId: groupType === 'server' ? (group as TeamSpeakServerGroup).sgid : (group as TeamSpeakChannelGroup).cgid,
                iconBuffer: '', iconGUID: '0'};
            this.fileCache.set(fileName, icon);
        }
        return icon;
    }

    private async getGroupIconFromTS(group: GroupModelType, groupType: 'channel' | 'server'): Promise<GroupIconCache | undefined> {
        let avatarBuffer;
        let cacheObject: GroupIconCache | undefined;
        if (group) {
            try {
                avatarBuffer = await group.getIcon();
            } catch (e) {
                console.error(`Error getting icon for ${groupType} ${group.name}`);
            }
            if (avatarBuffer) {
                cacheObject = {groupId: groupType === 'server' ? (group as TeamSpeakServerGroup).sgid : (group as TeamSpeakChannelGroup).cgid,
                    iconGUID: this.createId(), iconBuffer: avatarBuffer.toString('base64')};
            }
        }
        return Promise.resolve(cacheObject);
    }

    private createId() {
        return uuidv4();
    }
}
