import { WebRtcConnection } from '../connections/webrtcConnection';
import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import { Writable, Readable } from 'stream';
import { IPCMessage, IPCMessageDataType, IPCMessageVoice } from '../../models/rtc/IPCMessage';
import { IPC } from 'node-ipc';
import { ts3Config } from '../../config';
import { TsClientConnectionManager } from './tsClientConnectionManager';
const {RTCAudioSink, RTCAudioSource} = require('wrtc').nonstandard;
const EventEmitter = require('events');
const path = require('path');

export class TsClientConnection extends EventEmitter {
    public id: string;
    public webRtcConnection: WebRtcConnection;
    // public tsClient!: ChildProcessWithoutNullStreams;
    public dataChannel: RTCDataChannel;
    public clid = '-1';
    private peerConnection: RTCPeerConnection;
    private MAX_OUTSTREAM_BYTELENGTH = 960;
    private receivingAudio = true;
    private rtcConnected = false;
    private sink: any;
    private source: any;
    private remainingData = 0;
    private currentIndex = 0;
    private manager: TsClientConnectionManager;

    constructor(id: string, manager: TsClientConnectionManager) {
        super();
        this.id = id;
        this.manager = manager;
        // this.setupManagerListener();
        this.webRtcConnection = new WebRtcConnection(id);
        this.webRtcConnection.peerConnection.addTransceiver('audio');
        this.peerConnection = this.webRtcConnection.peerConnection;
        this.dataChannel = this.webRtcConnection.peerConnection.createDataChannel('dataChannel');
        // get some of this from the ui, and the environment constants from the config
        this.peerConnection.addEventListener('connectionstatechange', this.rtcConnectionListener);
    }

    // setupManagerListener() {
    //     process.on('message', (msg: IPCMessage) => {
    //         switch (msg.type) {
    //             case 'doOffer': this.webRtcConnection.doOffer(); break;
    //             case 'answer': this.webRtcConnection.applyAnswer(msg.data); break;
    //         }
    //     });
    // }


    // goes to rtcApp

    // setupTsClient() {
    //     this.ipc.config.id = this.id;
    //     this.ipc.config.appspace = 'NodeTS';
    //     this.ipc.serve(this.id, () => {
    //         this.tsClient = spawn(
    //             this.clientPath,
    //             [this.id, 'TSWebClient', '', '/25', '', ts3Config.host, ts3Config.serverPassword]
    //         );
    //     });
    //     this.ipc.server.start();
    //     this.setupIPCListener();
    // }

    // setupIPCListener() {
    //     this.ipc.server.on('data', data => {
    //         const msg = JSON.parse(data.toString()) as IPCMessage;
    //         switch (msg.type) {
    //             case 'CLIENT_ID': this.dataChannel.send(JSON.stringify(msg)); break;
    //         }
    //     });
    // }

    private rtcConnectionListener = () => {
        if (this.peerConnection.connectionState === 'connected' && !this.rtcConnected) {
            this.rtcConnected = true;
            this.setupAudioInput();
            this.setupAudioOutput();
            this.setupDataChannel();
            // this.tsClient.on('close', (code: number, signal: string) => {
            //     console.log('CLOSE');
            //     console.log(code);
            //     console.log(signal);
            // });
            // this.tsClient.on('exit', (code: number, signal: string) => {
            //     console.log('EXIT');
            //     console.log(code);
            //     console.log(signal);
            // });
        } else if (
            this.peerConnection.connectionState === 'closed' ||
            this.peerConnection.connectionState === 'failed' ||
            this.peerConnection.connectionState === 'disconnected'
        ) {
            // this.tsClient.stdout.destroy();
            // this.tsClient.stdin.end();
            // this.tsClient.kill();
            if (this.sink) {
                this.sink.ondata = null;
            }
        }
    }

    setupAudioInput() {
        this.sink = new RTCAudioSink(this.peerConnection.getTransceivers()[0].receiver.track);
        this.sink.ondata = (data: any) => {
            if (!this.receivingAudio) {
                const buffer = Buffer.from(data.samples.buffer as ArrayBuffer);
                // if (this.tsClient && this.tsClient.stdin && (this.tsClient.stdin as any).readyState !== 'closed' && !this.tsClient.killed) {
                //     (this.tsClient.stdin as Writable).write(buffer);
                // }
                const message: IPCMessage<IPCMessageVoice> = {type: IPCMessageDataType.SEND_VOICE, data: {buffer}};
                this.manager.sendIPCMessage(message);
            }
        };
    }

    setupAudioOutput() {
        this.source = new RTCAudioSource();
        const track = this.source.createTrack();
        this.peerConnection.getSenders()[0].replaceTrack(track);
    }

    receiveAudio(data: Uint8Array) {
        // remove packet headers
        const headers = data.slice(0, 2);
        const audioBuffer = Uint8Array.from(data.slice(2));
        this.remainingData = audioBuffer.byteLength;
        this.currentIndex = 0;
        while (this.remainingData > 0) {
            try {
                if (this.remainingData >= this.MAX_OUTSTREAM_BYTELENGTH) {
                    // dataChannel.send(`{"type": "TALKINGCLIENT", "data": "${headers[2] + headers[3]}"}`);
                    this.source.onData(
                        {
                            samples: audioBuffer.buffer.slice(this.currentIndex, this.MAX_OUTSTREAM_BYTELENGTH + this.currentIndex),
                            sampleRate: 48000
                        }
                    );
                    this.remainingData -= this.MAX_OUTSTREAM_BYTELENGTH;
                    this.currentIndex += this.MAX_OUTSTREAM_BYTELENGTH;
                } else {
                    // dataChannel.send(`{"type": "TALKINGCLIENT", "data": "${headers[2] + headers[3]}"}`);
                    audioBuffer.set(audioBuffer.slice(this.currentIndex));
                    audioBuffer.fill(0, this.currentIndex);
                    this.source.onData(
                        {
                            samples: audioBuffer.buffer.slice(this.currentIndex, audioBuffer.byteLength),
                            sampleRate: 48000
                        }
                    );
                    this.remainingData = 0;
                    this.currentIndex = 0;
                }
            } catch (e) {
                console.log(e);
                this.remainingData = 0;
            }
        }
    }

    closeConnection() {
        // (this.ipc.server as any).broadcast('DISCONNECT');
        // lazy, should improve this timing
        setTimeout(() => {
            this.dataChannel.close();
            this.webRtcConnection.close();
            this.manager.deleteConnection(this.id);
            // if (process.send) {
            //     process.send({type: 'close'} as IPCMessage);
            // }
        }, 1000);
    }

    setupDataChannel() {
        this.dataChannel.onopen = () => {

        };
        this.dataChannel.onclose = () => {

        };
        this.dataChannel.onmessage = message => {
            const messageData = JSON.parse(message.data) as IPCMessage;
            switch (messageData.type) {
                case IPCMessageDataType.VAD_ACTIVE: this.receivingAudio = true; break;
                case IPCMessageDataType.VAD_INACTIVE: this.receivingAudio = false; break;
                case IPCMessageDataType.DISCONNECT: this.closeConnection(); break;
                case IPCMessageDataType.TOGGLE_MUTE_INPUT: this.sendIPCMessage(messageData); break;
                case IPCMessageDataType.TOGGLE_MUTE_OUTPUT: this.sendIPCMessage(messageData); break;
                case IPCMessageDataType.JOIN_CHANNEL: this.sendIPCMessage(messageData); break;
            }
        };
    }

    sendIPCMessage(messageData: IPCMessage) {
        this.manager.sendIPCMessage(messageData);
    }

    public toJSON() {
        return this.webRtcConnection.toJSON();
    }
}

// REQUIRED FOR STARTING AS A CHILD PROCESS
// new TsClientConnection(process.argv[2]);
