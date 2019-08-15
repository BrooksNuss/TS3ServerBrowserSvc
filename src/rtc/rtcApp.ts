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
    let muted = true;
    // audio sink data to stream here
    const sink = new RTCAudioSink(peerConnection.getTransceivers()[0].receiver.track);
    // TODO create rtcaudiodata model
    // let count = 0;
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
    const source = new RTCAudioSource(peerConnection.getSenders()[0].track);
    // uint8 array of double size because the data coming back is uint8s
    const samples = {buffer: new Uint8Array(960), sampleRate: 48000};
    let currentIndex = 0;
    (tsClient.stdout as Readable).on('data', (data: Uint8Array) => {
        if (tsClient && tsClient.stdout && (tsClient.stdout as any).readyState !== 'closed') {
            console.log(data);
            const newIndex = currentIndex + data.byteLength;
            // needs testing to make sure there are no off by ones

            if (newIndex < samples.buffer.byteLength) {
                samples.buffer.set(data, currentIndex);
                currentIndex += data.byteLength;
            } else if (newIndex > samples.buffer.byteLength) {
                // write until samples is full, send, then write the rest and continue
                const remainingSpace = samples.buffer.byteLength - newIndex;
                const writable = data.slice(0, remainingSpace);
                const leftover = data.slice(remainingSpace);
                samples.buffer.set(writable, currentIndex);
                source.onData({samples: Int16Array.from(samples.buffer).buffer, sampleRate: 48000});
                samples.buffer.set(leftover);
                currentIndex = leftover.byteLength;
            } else {
                samples.buffer.set(data, currentIndex);
                source.onData({samples: Int16Array.from(samples.buffer).buffer, sampleRate: 48000});
                currentIndex = 0;
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
    peerConnection.addEventListener('connectionstatechange', () => {
        if (peerConnection.connectionState === 'closed' || peerConnection.connectionState === 'failed') {
            tsClient.stdout.destroy();
            tsClient.stdin.end();
            tsClient.kill();
            sink.ondata = null;
        }
    });
    const dataChannel = peerConnection.createDataChannel('dataChannel');
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
