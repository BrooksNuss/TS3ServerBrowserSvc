import { TsClientConnection } from './tsClientConnection';
import { fork, ChildProcess } from 'child_process';
import { IPCMessage } from '../../models/rtc/IPCMessage';
const uuidv4 = require('uuid/v4');
const path = require('path');

export class TsClientConnectionManager {
    public connections: Map<string, ChildProcess>;
    // public closeListeners: Map<TsClientConnection, (...params: any[]) => any>;
    private childPath = path.resolve(__dirname, './tsClientConnection.js');

    constructor() {
        this.connections = new Map();
        // this.closeListeners = new Map();
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

    async createConnection(): Promise<RTCSessionDescriptionInit> {
        const id = this.createId();
        const connectionProcess = fork(this.childPath, [id], {execArgv: ['--inspect-brk'], silent: true});
        connectionProcess.on('close', () => {
            const proc = this.connections.get(id);
            if (proc) {
                proc.kill();
            }
            this.connections.delete(id);
        });
        connectionProcess.on('error', err => {
            console.log(err);
        });
        connectionProcess.stderr!.on('data', (data) => {
            console.log('stderr: ' + data);
        });
        connectionProcess.stdout!.on('data', (data) => {
            console.log('stdout: ' + data);
        });
        this.connections.set(id, connectionProcess);
        this.setupIPCListener(connectionProcess, id);
        connectionProcess.once('message', (message: IPCMessage) => {
            if (message.type === 'ready') {
                connectionProcess.send({type: 'doOffer'});
            }
        });
        return await new Promise((resolve, reject) => {
            function offerListener(message: IPCMessage<RTCSessionDescriptionInit>) {
                if (message.type === 'doOffer') {
                    resolve(message.data);
                    connectionProcess.removeListener('message', offerListener);
                }
            }
            connectionProcess.on('message', offerListener);
            connectionProcess.once('error', (message: IPCMessage) => {
                reject(message.data);
            });
            connectionProcess.once('close', reject);
        });
    }

    async applyAnswer(connectionProcess: ChildProcess, answer: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit> {
        connectionProcess.send({type: 'answer', data: answer} as IPCMessage<RTCSessionDescriptionInit>);
        return await new Promise((resolve, reject) => {
            connectionProcess.once('message', (message: IPCMessage<RTCSessionDescriptionInit>) => {
                if (message.type === 'answer') {
                    resolve(message.data);
                }
            });
            connectionProcess.once('close', reject);
            connectionProcess.once('error', (message: IPCMessage) => {
                reject(message.data);
            });
        });
    }

    setupIPCListener(process: ChildProcess, id: string) {
        process.on('message', (msg: IPCMessage) => {
            switch (msg.type) {
                // case 'doOffer':
                case 'close': {
                    const proc = this.connections.get(id);
                    if (proc) {
                        proc.kill();
                    }
                    this.connections.delete(id);
                }
            }
        });
    }

    public deleteConnection(id: string): boolean {
        // const listener = this.closeListeners.get(connection);
        // this.closeListeners.delete(connection);
        // connection.removeListener('closed', listener);
        const connection = this.getConnection(id);
        if (connection) {
            connection.removeAllListeners('closed');
            return this.connections.delete(id);
        }
        return false;
    }

    getConnection(id: string): ChildProcess | undefined {
        return this.connections.get(id);
    }

    getConnections(): ChildProcess[] {
        return [...this.connections.values()];
    }

    private generateId(): string {
        return uuidv4();
    }

    // toJSON() {
    //     return this.getConnections().map(connection => connection.webRtcConnection.toJSON());
    // }
}
