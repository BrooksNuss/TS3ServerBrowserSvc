import { ConnectionManager } from './connectionManager';
import { Connection } from './connection';
const WebRtcConnection = require('./webrtcconnection');

export class WebRtcConnectionManager {
    public connectionManager: ConnectionManager;

    constructor(options: any) {
        this.connectionManager = new ConnectionManager(options);

    }

    static create(options: any) {
        return new WebRtcConnectionManager({
            Connection: (id: string) => {
                return new WebRtcConnection(id, options);
            }
        });
    }

    async createConnection() {
        const connection = this.connectionManager.createConnection();
        await connection.doOffer();
        return connection;
    }

    getConnection(id: string): Connection | undefined {
        return this.connectionManager.getConnection(id);
    }

    getConnections(): Connection[] {
        return this.connectionManager.getConnections();
    }

    toJSON() {
        return this.getConnections().map(connection => connection.toJSON());
    }
}
