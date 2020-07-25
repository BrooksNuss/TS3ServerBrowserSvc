import { ts3, socketServerService, serverStateService } from '../app';
import { ClientStatus } from 'models/cache/CacheModels';
import { ClientStatusResponse } from 'models/response/TSResponses';
import { TeamSpeakClient } from 'ts3-nodejs-library/lib/node/Client';

export class ClientStatusService {
    // public clientCache: NodeCache;
    private interval: NodeJS.Timeout;

    constructor() {
        // cache clients until they disconnect, check away status every 5s
        // this.clientCache = new NodeCache({stdTTL: 5, deleteOnExpire: false, checkperiod: 5});
        // this.clientCache.set('updateCheck', 0);
        // this.clientCache.on('expired', (k, v) => {
        //     this.updateClientStatuses();
        // });
        this.interval = setInterval(this.updateClientStatuses, 5000);
    }

    // should use cldbid instead of clid so that we can handle users going offline
    async updateClientStatuses() {
        const clientList = await ts3.clientList();
        serverStateService.clients.forEach(client => {
            const tsClient = clientList.find(tc => tc.clid === client.clid);
            if (tsClient) {
                client.idleTime = tsClient.idleTime;
            }
        });
        const statusList: ClientStatus[] = [];
        clientList.forEach(client => {
            if (client.away) {
                statusList.push({clientDBId: client.databaseId, status: 'AWAY'});
            } else if (client.idleTime) {
                if (client.idleTime >= 300000) {
                    statusList.push({clientDBId: client.databaseId, status: 'INACTIVE'});
                } else {
                    statusList.push({clientDBId: client.databaseId, status: 'ACTIVE'});
                }
            }
        });
        socketServerService.socketEmit<ClientStatusResponse>('clientstatus', {clients: statusList});
    }
}
