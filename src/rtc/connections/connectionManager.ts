import { Connection } from './connection';

const uuidv4 = require('uuid/v4');

const DefaultConnection = require('./connection');

export class ConnectionManager {
    public connections: Map<string, Connection>;
    public closeListeners: Map<Connection, (...params: any[]) => any>;

    constructor(options = {}) {
        options = {
            Connection: DefaultConnection,
            generateId: uuidv4,
            ...options
        };

        this.connections = new Map();
        this.closeListeners = new Map();
    }

    private createId() {
        let id: string;
        do {
            id = this.generateId();
        } while (this.connections.has(id));
        return id;
    }

    public deleteConnection(connection: Connection) {
        const listener = this.closeListeners.get(connection);
        this.closeListeners.delete(connection);
        // connection.removeListener('closed', listener);
        connection.removeAllListeners('closed');
        this.connections.delete(connection.id);
    }

    public createConnection(): Connection {
        const id = this.createId();
        const connection = new Connection(id);
        const listener = (conn: Connection) => this.deleteConnection(conn);
        this.closeListeners.set(connection, listener);
        connection.once('closed', listener);

        // 2. Add the Connection to the Map.
        this.connections.set(connection.id, connection);
        return connection;
    }

    public getConnection(id: string): Connection | undefined {
        return this.connections.get(id);
    }

    public getConnections(): Connection[] {
        return [...this.connections.values()];
    }

    private generateId(): string {
        return uuidv4();
    }

    toJSON() {
        return this.getConnections().map(connection => connection.toJSON());
    }
}
