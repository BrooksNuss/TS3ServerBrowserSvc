import {spawn} from 'child_process';
import { Writable, Readable } from 'stream';
const WebRtcConnectionManager = require('./connections/webrtcconnectionmanager.js');
const {RTCAudioSink, RTCAudioSource} = require('wrtc').nonstandard;
const path = require('path');
const clientPath = path.resolve(__dirname, '../../../TS3AudioBot/NodeTSClient/bin/Debug/NodeTSClient.exe');

const connectionManager = WebRtcConnectionManager.create({beforeOffer});

function beforeOffer(peerConnection: RTCPeerConnection) {
    // const clientReady = false;
    const transceiver = peerConnection.addTransceiver('audio');
    startTSClient(peerConnection);
    peerConnection.addEventListener('connectionstatechange', () => onConnectionStateChange(peerConnection));
    return Promise.all([transceiver.sender.replaceTrack(transceiver.receiver.track)]);
}

function onConnectionStateChange(peerConnection: RTCPeerConnection) {
    if (peerConnection.connectionState === 'closed' || peerConnection.connectionState === 'failed') {
        
    }
}

function startTSClient(peerConnection: RTCPeerConnection) {
    const tsClient = spawn(clientPath, ['TSWebClient', '/25']);
    tsClient.on('error', (err) => {
        console.log('Error spawning process');
        console.error(err);
    });
    // audio sink data to stream here
    const sink = new RTCAudioSink(peerConnection.getTransceivers()[0].receiver.track);
    // TODO create rtcaudiodata model
    sink.ondata = (data: any) => {
        const buffer = new Buffer(Buffer.from(data.samples.buffer as ArrayBuffer));
        (tsClient.stdin as Writable).write(buffer);
    };
    // read stdout and add data to an audio source then send that into the sender track
    const source = new RTCAudioSource(peerConnection.getSenders()[0].track);
    (tsClient.stdout as Readable).on('data', data => {
        console.log(data);
        console.log(source);
    });
}

export {connectionManager};
