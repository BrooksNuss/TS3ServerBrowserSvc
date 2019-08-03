import {fork} from 'child_process';
import { Writable, Readable } from 'stream';
const WebRtcConnectionManager = require('./connections/webrtcconnectionmanager.js');
const {RTCAudioSink, RTCAudioSource} = require('wrtc').nonstandard;

const connectionManager = WebRtcConnectionManager.create({beforeOffer});
let clientReady = false;

function beforeOffer(peerConnection: RTCPeerConnection) {
    let transceiver = peerConnection.addTransceiver('audio');
    startTSClient(peerConnection);
    return Promise.all([transceiver.sender.replaceTrack(transceiver.receiver.track)]);
}

function startTSClient(peerConnection: RTCPeerConnection) {
    const tsClient = fork('../../../../ts3 stuff/TSClient/NodeTSClient.exe', ['TSWebClient']);
    // audio sink data to stream here
    const sink = new RTCAudioSink(peerConnection.getTransceivers()[0].receiver.track);
    sink.ondata = (data: Int16Array) => {
        (tsClient.stdin as Writable).write(data.buffer);
    };
    (tsClient.stdout as Readable).on('data', data => {
        
    });
    const source = new RTCAudioSource();
}

export {connectionManager};
