const WebRtcConnectionManager = require('./connections/webrtcconnectionmanager.js');
const {RtcAudioSink} = require('wrtc').nonstandard;

function beforeOffer(peerConnection: any) {
    // const {track} = peerConnection.addTransceiver('audio').receiver;
    // const sink = new RtcAudioSink(track);

    // const dataChannel = peerConnection.createDataChannel('test');

    // function onData(data: any) {
    //     console.log(data);
    // }

    // sink.onData = onData;

    // const {close} = peerConnection;
    // peerConnection.close = function() {
    //     sink.stop();
    //     return close.apply(this, arguments);
    // };
}

const connectionManager = WebRtcConnectionManager.create(beforeOffer);

export {connectionManager};
