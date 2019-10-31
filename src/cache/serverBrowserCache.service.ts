import NodeCache from 'node-cache';
import { ts3 } from '../app';
import { TeamSpeakClient } from 'ts3-nodejs-library/lib/node/Client';

export class ServerBrowserCacheService {
    public fileCache: NodeCache;

    constructor() {
        // cache items for 1 day, delete expired items every hour
        this.fileCache = new NodeCache({stdTTL: 86400, checkperiod: 3600});
    }

    async getAvatar(client: TeamSpeakClient): Promise<string> {
        const avatarKey = `avatar_${client.databaseId}`;
        let avatarString = this.fileCache.get<string>(avatarKey);
        if (avatarString) {
            return Promise.resolve(avatarString);
        } else {
            try {
                const avatarBuffer = await client.getAvatar();
                // save encoded. more memory usage, less cpu time per fetch. could swap if memory usage too high.
                avatarString = avatarBuffer.toString('base64');
                this.fileCache.set(avatarKey, avatarString);
                return Promise.resolve(avatarString);
            } catch (e) {
                console.error(e);
                return Promise.resolve('');
            }
        }
    }
}
