import { ts3, socketServer } from '../app';
import { ClientStatus } from './models/ClientStatus';

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
        const statusArr: ClientStatus[] = [];
        clientList.forEach(client => {
            if (client.away) {
                statusArr.push({clientDBId: client.databaseId, status: 'AWAY'});
            } else if (client.idleTime) {
                if (client.idleTime >= 300000) {
                    statusArr.push({clientDBId: client.databaseId, status: 'INACTIVE'});
                } else {
                    statusArr.push({clientDBId: client.databaseId, status: 'ACTIVE'});
                }
            }
        });
        socketServer.emit('clientstatus', {statusArr});
    }
}
