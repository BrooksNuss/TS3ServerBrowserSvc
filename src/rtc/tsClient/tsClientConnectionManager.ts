import { TsClientConnection } from './tsClientConnection';
import { IPCMessage, IPCMessageConnect, IPCMessageDataType } from '../../models/rtc/IPCMessage';
import { IPC } from 'node-ipc';
import { RTCCreateConnectionResponse } from 'models/rtc/RTCResponses';
const uuidv4 = require('uuid/v4');
const path = require('path');

export class TsClientConnectionManager {
    public connections: Map<string, TsClientConnection> = new Map();
    private ipc = new IPC();
    private id = 'NodeTsStream';

    constructor() {}

    private createId() {
        let id: string;
        do {
            id = this.generateId();
        } while (this.connections.has(id));
        return id;
    }

    async createConnection(): Promise<RTCCreateConnectionResponse> {
        const id = this.createId();
        const client = new TsClientConnection(id, this);
        this.connections.set(id, client);
        try {
            return { offer: await client.webRtcConnection.doOffer(), id };
        } catch (e) {
            return Promise.reject(e);
        }
        // const connectionProcess = fork(this.childPath, [id], {execArgv: ['--inspect-brk'], silent: true});
        // connectionProcess.on('close', () => {
        //     const proc = this.connections.get(id);
        //     if (proc) {
        //         proc.kill();
        //     }
        //     this.connections.delete(id);
        // });
        // connectionProcess.on('error', err => {
        //     console.log(err);
        // });
        // connectionProcess.stderr!.on('data', (data) => {
        //     console.log('stderr: ' + data);
        // });
        // connectionProcess.stdout!.on('data', (data) => {
        //     console.log('stdout: ' + data);
        // });
        // this.connections.set(id, connectionProcess);
        // this.setupIPCListener(connectionProcess, id);
        // connectionProcess.once('message', (message: IPCMessage) => {
        //     if (message.type === 'ready') {
        //         connectionProcess.send({type: 'doOffer'});
        //     }
        // });
        // return await new Promise((resolve, reject) => {
        //     function offerListener(message: IPCMessage<RTCSessionDescriptionInit>) {
        //         if (message.type === 'doOffer') {
        //             resolve(message.data);
        //             connectionProcess.removeListener('message', offerListener);
        //         }
        //     }
        //     connectionProcess.on('message', offerListener);
        //     connectionProcess.once('error', (message: IPCMessage) => {
        //         reject(message.data);
        //     });
        //     connectionProcess.once('close', reject);
        // });
    }

    async applyAnswer(clientConnection: TsClientConnection, answer: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit> {
        // clientConnection.webRtcConnection.applyAnswer(answer);
        return await clientConnection.webRtcConnection.applyAnswer(answer);
    }

    public deleteConnection(id: string): boolean {
        const connection = this.getConnection(id);
        if (connection) {
            // connection.removeAllListeners('closed');
            return this.connections.delete(id);
        }
        return false;
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

    setupTsClient() {
        this.ipc.config.id = this.id;
        this.ipc.config.appspace = 'NodeTS';
        this.ipc.serve(this.id);
        this.ipc.server.start();
        this.setupIPCListener();
    }

    setupIPCListener() {
        this.ipc.server.on('data', data => {
            const msg = JSON.parse(data.toString()) as IPCMessage;
            const msgData: IPCMessageConnect = msg.data;
            const conn = this.getConnection(msgData.id);
            switch (msg.type) {
                case IPCMessageDataType.CONNECT:
                    if (conn && msg.clid) {
                        conn.clid = msg.clid;
                    }
                    break;
                case IPCMessageDataType.DISCONNECT:
                    if (conn) {
                        conn.dataChannel.close();
                        conn.webRtcConnection.close();
                    }
                    break;
                case IPCMessageDataType.RECEIVE_VOICE:
                    if (conn) {
                        conn.receiveAudio(msg.data);
                    }
            }
        });
    }

    public sendIPCMessage(message: IPCMessage) {
        (this.ipc.server as any).broadcast(message);
    }
}
