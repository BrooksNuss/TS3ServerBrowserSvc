import NodeCache from 'node-cache';
import { ts3 } from '../app';
import { TeamSpeakClient } from 'ts3-nodejs-library/lib/node/Client';

export class ServerBrowserCacheService {
    public fileCache: NodeCache;

    constructor() {
        // cache items for 1 day, delete expired items every hour
        this.fileCache = new NodeCache({stdTTL: 86400, checkperiod: 3600});
    }

    private async getClientAvatar(client: TeamSpeakClient): Promise<Buffer | undefined> {
        let avatarBuffer;
        try {
            avatarBuffer = await client.getAvatar();
        } catch (e) {
            console.error(e);
        }
        return Promise.resolve(avatarBuffer);
    }

    async getFileByName(filename: string): Promise<Buffer | undefined> {
        const filepath = `/${filename}`;
        let file = this.fileCache.get<Buffer>(filepath);
        if (!file) {
            try {
                file = await ts3.downloadFile(filepath);
                this.fileCache.set(filename, file);
            } catch (e) {
                console.error(e);
            }
        }
        return Promise.resolve(file);
    }

    async getAvatarByName(clientDBId: number): Promise<Buffer | undefined> {
        const avatarKey = `client_${clientDBId}_avatar`;
        let avatarBuffer = this.fileCache.get<Buffer>(avatarKey);
        if (!avatarBuffer) {
            const client = await ts3.getClientByDBID(clientDBId);
            if (client) {
                avatarBuffer = await this.getClientAvatar(client);
                this.fileCache.set(avatarKey, avatarBuffer);
            }
        }
        return Promise.resolve(avatarBuffer);
    }
}
