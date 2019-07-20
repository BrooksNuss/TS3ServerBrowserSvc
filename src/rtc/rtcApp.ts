const WebRtcConnectionManager = require('./connections/webrtcconnectionmanager.js');
const {RtcAudioSink} = require('wrtc').nonstandard;

const connectionManager = WebRtcConnectionManager.create({beforeOffer});

function beforeOffer(peerConnection: RTCPeerConnection) {
    // peerConnection.ontrack = (track: MediaTrack) => {
    //     console.log(track);
    // };
    const audioTransceiver = peerConnection.addTransceiver('audio');
    audioTransceiver.sender.replaceTrack(audioTransceiver.receiver.track);
    let sink = new RtcAudioSink(audioTransceiver.receiver.track);
    sink.onData = (data: any) => {
        console.log(data);
    }
    return audioTransceiver.receiver.track;
}

export {connectionManager};
