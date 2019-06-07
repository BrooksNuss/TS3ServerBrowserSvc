const WebRtcConnectionManager = require('./connections/webrtcconnectionmanager.js');
const {RtcAudioSink} = require('wrtc').nonstandard;

const connectionManager = WebRtcConnectionManager.create({beforeOffer});

function beforeOffer(peerConnection: any) {
    peerConnection.ontrack = (track: any) => {
        console.log(track);
    };
}

export {connectionManager};
