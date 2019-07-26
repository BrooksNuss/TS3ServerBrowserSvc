const WebRtcConnectionManager = require('./connections/webrtcconnectionmanager.js');

const connectionManager = WebRtcConnectionManager.create({beforeOffer});

function beforeOffer(peerConnection: RTCPeerConnection) {
    let transceiver = peerConnection.addTransceiver('audio');
    return Promise.all([transceiver.sender.replaceTrack(transceiver.receiver.track)]);
}

export {connectionManager};
