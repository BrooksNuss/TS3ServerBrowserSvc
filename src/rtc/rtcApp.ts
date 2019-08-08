import {spawn, ChildProcessWithoutNullStreams} from 'child_process';
import { Writable, Readable } from 'stream';
const WebRtcConnectionManager = require('./connections/webrtcconnectionmanager.js');
const {RTCAudioSink, RTCAudioSource} = require('wrtc').nonstandard;
const path = require('path');
const clientPath = path.resolve(__dirname, '../../lib/NodeTSClient/NodeClient/bin/Debug/NodeClient.exe');

const connectionManager = WebRtcConnectionManager.create({beforeOffer});

function beforeOffer(peerConnection: RTCPeerConnection) {
    // const clientReady = false;
    const transceiver = peerConnection.addTransceiver('audio');
    const client = startTSClient(peerConnection);
    // return Promise.all([transceiver.sender.replaceTrack(transceiver.receiver.track)]);
}

function startTSClient(peerConnection: RTCPeerConnection) {
    const tsClient = spawn(clientPath, ['TSWebClient', '', '/25']);
    console.log(tsClient.pid);
    tsClient.on('error', (err) => {
        console.log('Error spawning process');
        console.error(err);
    });
    // audio sink data to stream here
    const sink = new RTCAudioSink(peerConnection.getTransceivers()[0].receiver.track);
    // TODO create rtcaudiodata model
    let count = 0;
    sink.ondata = (data: any) => {
        const buffer = Buffer.from(data.samples.buffer as ArrayBuffer);
        if (tsClient && tsClient.stdin && (tsClient.stdin as any).readyState !== 'closed' && !tsClient.killed) {
            console.log(data.samples);
            console.log(count++);
            (tsClient.stdin as Writable).write(buffer);
        }
    };
    // read stdout and add data to an audio source then send that into the sender track
    const source = new RTCAudioSource(peerConnection.getSenders()[0].track);
    (tsClient.stdout as Readable).on('data', data => {
        if (tsClient && tsClient.stdout && (tsClient.stdout as any).readyState !== 'closed') {
            // console.log(data);
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
    peerConnection.addEventListener('connectionstatechange', () => {
        if (peerConnection.connectionState === 'closed' || peerConnection.connectionState === 'failed') {
            tsClient.stdout.destroy();
            tsClient.stdin.end();
            tsClient.kill();
            sink.ondata = null;
        }
    });
    return tsClient;
}

export {connectionManager};
