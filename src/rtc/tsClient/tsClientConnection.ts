import { WebRtcConnection } from '../connections/webrtcConnection';
import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import { Writable, Readable } from 'stream';
import { IPCMessage } from '../models/IPCMessage';
import { IPC } from 'node-ipc';
import { ts3Config } from '../../config';
const {RTCAudioSink, RTCAudioSource} = require('wrtc').nonstandard;
const EventEmitter = require('events');
const path = require('path');

export class TsClientConnection extends EventEmitter {
    public id: string;
    public webRtcConnection: WebRtcConnection;
    public tsClient!: ChildProcessWithoutNullStreams;
    private clientPath = path.resolve(__dirname, '../../../lib/NodeTSClient/NodeClient/bin/Debug/NodeClient.exe');
    private dataChannel: RTCDataChannel;
    private peerConnection: RTCPeerConnection;
    private MAX_OUTSTREAM_BYTELENGTH = 960;
    private muted = true;
    private rtcConnected = false;
    private sink: any;
    private source: any;
    private ipc = new IPC();

    constructor(id: string) {
        super();
        this.id = id;
        this.setupIPCListener();
        this.webRtcConnection = new WebRtcConnection(id);
        if (process.send) {
            process.send({type: 'ready'} as IPCMessage);
        }
        this.webRtcConnection.peerConnection.addTransceiver('audio');
        this.peerConnection = this.webRtcConnection.peerConnection;
        this.dataChannel = this.webRtcConnection.peerConnection.createDataChannel('dataChannel');
        // get some of this from the ui, and the environment constants from the config
        this.setupTsClient();
    }

    setupIPCListener() {
        process.on('message', (msg: IPCMessage) => {
            switch (msg.type) {
                case 'doOffer': this.webRtcConnection.doOffer(); break;
                case 'answer': this.webRtcConnection.applyAnswer(msg.data); break;
            }
        });
    }

    setupTsClient() {
        this.peerConnection.addEventListener('connectionstatechange', this.rtcConnectionListener);
        this.ipc.config.id = this.id;
        this.ipc.config.appspace = 'NodeTS';
        this.ipc.serve(this.id, () => {
            this.tsClient = spawn(
                this.clientPath,
                [this.id, 'TSWebClient', '', '/25', '', ts3Config.host, ts3Config.serverPassword]
            );
        });
        this.ipc.server.start();
    }

    setupAudioInput() {
        this.sink = new RTCAudioSink(this.peerConnection.getTransceivers()[0].receiver.track);
        this.sink.ondata = (data: any) => {
            if (!this.muted) {
                const buffer = Buffer.from(data.samples.buffer as ArrayBuffer);
                if (this.tsClient && this.tsClient.stdin && (this.tsClient.stdin as any).readyState !== 'closed' && !this.tsClient.killed) {
                    (this.tsClient.stdin as Writable).write(buffer);
                }
            }
        };
    }

    setupAudioOutput() {
        this.source = new RTCAudioSource();
        const track = this.source.createTrack();
        this.peerConnection.getSenders()[0].replaceTrack(track);
        let remainingData = 0;
        let currentIndex;
        (this.tsClient.stdout as Readable).on('data', (data: Uint8Array) => {
            // remove packet headers
            const headers = data.slice(0, 2);
            const audioBuffer = Uint8Array.from(data.slice(2));
            remainingData = audioBuffer.byteLength;
            currentIndex = 0;
            while (remainingData > 0) {
                try {
                    if (remainingData >= this.MAX_OUTSTREAM_BYTELENGTH) {
                        // dataChannel.send(`{"type": "talkingClient", "data": "${headers[2] + headers[3]}"}`);
                        this.source.onData(
                            {
                                samples: audioBuffer.buffer.slice(currentIndex, this.MAX_OUTSTREAM_BYTELENGTH + currentIndex),
                                sampleRate: 48000
                            }
                        );
                        remainingData -= this.MAX_OUTSTREAM_BYTELENGTH;
                        currentIndex += this.MAX_OUTSTREAM_BYTELENGTH;
                    } else {
                        // dataChannel.send(`{"type": "talkingClient", "data": "${headers[2] + headers[3]}"}`);
                        audioBuffer.set(audioBuffer.slice(currentIndex));
                        audioBuffer.fill(0, currentIndex);
                        this.source.onData(
                            {
                                samples: audioBuffer.buffer.slice(currentIndex, audioBuffer.byteLength),
                                sampleRate: 48000
                            }
                        );
                        remainingData = 0;
                        currentIndex = 0;
                    }
                } catch (e) {
                    console.log(e);
                    remainingData = 0;
                }
            }
        });
    }

    closeConnection() {
        (this.ipc.server as any).broadcast('DISCONNECT');
        // lazy, should improve this timing
        setTimeout(() => {
            this.dataChannel.close();
            this.webRtcConnection.close();
            if (process.send) {
                process.send({type: 'close'} as IPCMessage);
            }
        }, 1000);
    }

    setupDataChannel() {
        this.dataChannel.onopen = () => {

        };
        this.dataChannel.onclose = () => {

        };
        this.dataChannel.onmessage = message => {
            switch (message.data) {
                case 'mute': this.muted = true; break;
                case 'unmute': this.muted = false; break;
                case 'close': this.closeConnection(); break;
            }
        };
    }

    private rtcConnectionListener = () => {
        if (this.peerConnection.connectionState === 'connected' && !this.rtcConnected) {
            this.rtcConnected = true;
            this.setupAudioInput();
            this.setupAudioOutput();
            this.setupDataChannel();
            this.tsClient.on('close', (code: number, signal: string) => {
                console.log('CLOSE');
                console.log(code);
                console.log(signal);
            });
            this.tsClient.on('exit', (code: number, signal: string) => {
                console.log('EXIT');
                console.log(code);
                console.log(signal);
            });
        } else if (
            this.peerConnection.connectionState === 'closed' ||
            this.peerConnection.connectionState === 'failed' ||
            this.peerConnection.connectionState === 'disconnected'
        ) {
            this.tsClient.stdout.destroy();
            this.tsClient.stdin.end();
            this.tsClient.kill();
            if (this.sink) {
                this.sink.ondata = null;
            }
        }
    }

    public toJSON() {
        return this.webRtcConnection.toJSON();
    }
}

// REQUIRED FOR STARTING AS A CHILD PROCESS
new TsClientConnection(process.argv[2]);
