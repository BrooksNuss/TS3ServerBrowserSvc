import {spawn, ChildProcessWithoutNullStreams} from 'child_process';
import { Writable, Readable } from 'stream';
const WebRtcConnectionManager = require('./connections/webrtcconnectionmanager.js');
const {RTCAudioSink, RTCAudioSource} = require('wrtc').nonstandard;
const path = require('path');
const clientPath = path.resolve(__dirname, '../../lib/NodeTSClient/NodeClient/bin/Debug/NodeClient.exe');

const connectionManager = WebRtcConnectionManager.create({beforeOffer});

function beforeOffer(peerConnection: RTCPeerConnection) {
    const transceiver = peerConnection.addTransceiver('audio');
    const client = startTSClient(peerConnection);
}

function startTSClient(peerConnection: RTCPeerConnection) {
    let dataChannel: RTCDataChannel;
    // const sampleBuffer = new Uint8Array(960);
    let currentIndex = 0;
    let source: any;
    let packetCount = 0;
    const MAX_STREAM_BYTELENGTH = 960;
    const tsClient = spawn(clientPath, ['TSWebClient', '', '/25']);
    console.log(tsClient.pid);
    tsClient.on('error', (err) => {
        console.log('Error spawning process');
        console.error(err);
    });
    let muted = true;
    let connected = false;
    // audio sink data to stream here
    const sink = new RTCAudioSink(peerConnection.getTransceivers()[0].receiver.track);
    // TODO create rtcaudiodata model
    sink.ondata = (data: any) => {
        if (!muted) {
            const buffer = Buffer.from(data.samples.buffer as ArrayBuffer);
            // console.log(data.samples);
            if (tsClient && tsClient.stdin && (tsClient.stdin as any).readyState !== 'closed' && !tsClient.killed) {
                // console.log(data.samples);
                // console.log(count++);
                (tsClient.stdin as Writable).write(buffer);
            }
        }
    };
    // read stdout and add data to an audio source then send that into the sender track
    // need to wait for rtc connection to complete
    peerConnection.addEventListener('connectionstatechange', () => {
        if (peerConnection.connectionState === 'connected' && !connected) {
            connected = true;
            source = new RTCAudioSource();
            const track = source.createTrack();
            peerConnection.getSenders()[0].replaceTrack(track);
            let remainingData = 0;
            (tsClient.stdout as Readable).on('data', (data: Uint8Array) => {
                // remove packet headers
                const headers = data.slice(0, 2);
                const audioBuffer = Uint8Array.from(data.slice(2));
                remainingData = audioBuffer.byteLength;
                currentIndex = 0;
                while (remainingData > 0) {
                    try {
                        if (remainingData >= MAX_STREAM_BYTELENGTH) {
                            // dataChannel.send(`{"type": "talkingClient", "data": "${headers[2] + headers[3]}"}`);
                            source.onData(
                                {
                                    samples: audioBuffer.buffer.slice(currentIndex, MAX_STREAM_BYTELENGTH + currentIndex),
                                    sampleRate: 48000
                                }
                            );
                            packetCount++;
                            remainingData -= MAX_STREAM_BYTELENGTH;
                            currentIndex += MAX_STREAM_BYTELENGTH;
                        } else {
                            // dataChannel.send(`{"type": "talkingClient", "data": "${headers[2] + headers[3]}"}`);
                            audioBuffer.set(audioBuffer.slice(currentIndex));
                            audioBuffer.fill(0, currentIndex);
                            source.onData(
                                {
                                    samples: audioBuffer.buffer.slice(currentIndex, audioBuffer.byteLength),
                                    sampleRate: 48000
                                }
                            );
                            packetCount++;
                            remainingData = 0;
                            currentIndex = 0;
                        }
                    } catch (e) {
                        console.log(e);
                        remainingData = 0;
                    }
                }
            });
            tsClient.on('close', (code: number, signal: string) => {
                console.log('CLOSE');
                console.log(code);
                console.log(signal);
            });
            tsClient.on('exit', (code: number, signal: string) => {
                console.log('EXIT');
                console.log(code);
                console.log(signal);
            });
        } else if (
            peerConnection.connectionState === 'closed' ||
            peerConnection.connectionState === 'failed' ||
            peerConnection.connectionState === 'disconnected'
        ) {
                    tsClient.stdout.destroy();
                    tsClient.stdin.end();
                    tsClient.kill();
                    sink.ondata = null;
        }
    });
    dataChannel = peerConnection.createDataChannel('dataChannel');
    dataChannel.onopen = () => {

    };
    dataChannel.onclose = () => {

    };
    dataChannel.onmessage = message => {
        switch(message.data) {
            case 'mute': muted = true; break;
            case 'unmute': muted = false; break;
        }
    };
    return tsClient;
}

export {connectionManager};
