import { Connection } from './connection';

const uuidv4 = require('uuidv4');
const DefaultConnection = require('./connection');

export class ConnectionManager {
  public connections = new Map();
  public closedListeners = new Map();
  public options: any;

  constructor(options = {}) {
    options = {
      Connection: DefaultConnection,
      generateId: this.createId(),
      ...options
    };

    this.options = options;
  }

  createId(): string {
    let guid;
    do {
      guid = uuidv4();
    } while (!this.connections.has(guid));
    return guid;
  }

  deleteConnection(connection: Connection) {
    // 1. Remove "closed" listener.
    const closedListener = this.closedListeners.get(connection);
    this.closedListeners.delete(connection);
    connection.removeListener('closed', closedListener);

    // 2. Remove the Connection from the Map.
    this.connections.delete(connection.id);
  }

  createConnection() {
    const id = this.createId();
    const connection = new Connection(id);

    // 1. Add the "closed" listener.
    const closeListener = () => this.deleteConnection(connection);
    this.closedListeners.set(connection, closeListener);
    connection.once('closed', closeListener);

    // 2. Add the Connection to the Map.
    this.connections.set(connection.id, connection);

    return connection;
  }

  getConnection(id: string) {
    return this.connections.get(id);
  }

  getAllConnections() {
    return this.connections.values;
  }
}
