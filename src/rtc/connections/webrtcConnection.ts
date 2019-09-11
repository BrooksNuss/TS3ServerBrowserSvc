import { Connection } from './connection';
const DefaultRTCPeerConnection = require('wrtc').RTCPeerConnection;

export class WebRtcConnection extends Connection {
    private TIME_TO_CONNECTED = 10000;
    private TIME_TO_HOST_CANDIDATES = 3000;
    private TIME_TO_RECONNECTED = 10000;
    public RTCPeerConnection = DefaultRTCPeerConnection;
    public peerConnection: RTCPeerConnection;
    // beforeOffer
    // clearTimeout
    // setTimeout

    constructor(id: string, options: any) {
        super (id);
        this.peerConnection = new this.RTCPeerConnection({
            sdpSemantics: 'unified-plan',
            iceServers: [{
                urls: [
                'stun:stun.l.google.com:19302',
                'stun:stun1.l.google.com:19302'
                ]
            }]
        });
    }


}
