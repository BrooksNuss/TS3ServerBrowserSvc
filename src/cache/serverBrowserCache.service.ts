import NodeCache from 'node-cache';
import { ts3 } from '../app';
import { ClientAvatarCache } from './models/AvatarCacheModel';
const uuidv4 = require('uuidv4');

export class ServerBrowserCacheService {
    public fileCache: NodeCache;

    constructor() {
        // cache items for 1 day, delete expired items every hour
        this.fileCache = new NodeCache({stdTTL: 86400, checkperiod: 3600});
    }

    async getClientAvatar(clientDBId: number): Promise<ClientAvatarCache | undefined> {
        let avatarBuffer;
        const client = await ts3.getClientByDBID(clientDBId);
        let cacheObject: ClientAvatarCache | undefined;
        if (client) {
            try {
                avatarBuffer = await client.getAvatar();
            } catch (e) {
                console.error(e);
            }
            if (avatarBuffer) {
                cacheObject = {clientDBId, avatarGUID: this.createId(), avatarBuffer: avatarBuffer.toString('base64')};
                this.fileCache.set<ClientAvatarCache>(`client_${clientDBId}_avatar`, cacheObject);
            }
        }
        return Promise.resolve(cacheObject);
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

    async getAvatarByClientDBId(clientDBId: number): Promise<ClientAvatarCache | undefined> {
        let avatarBuffer = this.getCachedAvatar(clientDBId);
        if (!avatarBuffer) {
            avatarBuffer = await this.getClientAvatar(clientDBId);
        }
        return Promise.resolve(avatarBuffer);
    }

    getCachedAvatar(clientDBId: number): ClientAvatarCache | undefined {
        return this.fileCache.get<ClientAvatarCache>(`client_${clientDBId}_avatar`);
    }

    private createId() {
        return uuidv4();
    }
}
