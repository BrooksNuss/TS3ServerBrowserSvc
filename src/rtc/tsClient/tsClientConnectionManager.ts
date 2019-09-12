const uuidv4 = require('uuid/v4');
import { TsClientConnection } from './tsClientConnection';

export class WebRtcConnectionManager {
    public connections: Map<string, TsClientConnection>;
    public closeListeners: Map<TsClientConnection, (...params: any[]) => any>;

    constructor(options: any) {
        this.connections = new Map();
        this.closeListeners = new Map();
    }

    // static create(options: any) {
    //     return new WebRtcConnectionManager({
    //         Connection: (id: string) => {
    //             return new WebRtcConnection(id);
    //         }
    //     });
    // }

    private createId() {
        let id: string;
        do {
            id = this.generateId();
        } while (this.connections.has(id));
        return id;
    }

    async createConnection() {
        const id = this.createId();
        const connection = new TsClientConnection(id);
        const listener = (conn: TsClientConnection) => this.deleteConnection(conn);
        this.closeListeners.set(connection, listener);
        connection.once('closed', listener);

        // 2. Add the Connection to the Map.
        this.connections.set(connection.id, connection);
        await connection.webRtcConnection.doOffer();
        return connection;
    }

    public deleteConnection(connection: TsClientConnection) {
        const listener = this.closeListeners.get(connection);
        this.closeListeners.delete(connection);
        // connection.removeListener('closed', listener);
        connection.removeAllListeners('closed');
        this.connections.delete(connection.id);
    }

    getConnection(id: string): TsClientConnection | undefined {
        return this.connections.get(id);
    }

    getConnections(): TsClientConnection[] {
        return [...this.connections.values()];
    }

    private generateId(): string {
        return uuidv4();
    }

    toJSON() {
        return this.getConnections().map(connection => connection.webRtcConnection.toJSON());
    }
}
