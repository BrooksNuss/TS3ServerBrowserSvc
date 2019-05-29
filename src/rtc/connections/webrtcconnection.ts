const RTCPeerConnectionType = require('wrtc').RTCPeerConnection;

const Connection = require('./connection');

const TIME_TO_CONNECTED = 10000;
const TIME_TO_HOST_CANDIDATES = 3000;  // NOTE(mroberts): Too long.
const TIME_TO_RECONNECTED = 10000;

export class WebRtcConnection extends Connection {
    public options: any;
    public RTCPeerConnection: RTCPeerConnection;
    public beforeOffer: any;
    public timeToConnect = 10000;
    public timeToReconnect = 10000;
    public connectionTimer: any;

    constructor(id: string, options: any = {}) {
        super(id);

        options = {
            RTCPeerConnection: RTCPeerConnectionType,
            beforeOffer() {},
            clearTimeout,
            setTimeout,
            timeToConnected: TIME_TO_CONNECTED,
            timeToHostCandidates: TIME_TO_HOST_CANDIDATES,
            timeToReconnected: TIME_TO_RECONNECTED,
            ...options
        };

        this.options = options;
        this.RTCPeerConnection = options.RTCPeerConnection;
        this.beforeOffer = options.beforeOffer;

        const peerConnection = new RTCPeerConnectionType({
            sdpSemantics: 'unified-plan'
        });

        this.beforeOffer(peerConnection);

        this.connectionTimer = options.setTimeout(() => {
            if (peerConnection.iceConnectionState !== 'connected'
              && peerConnection.iceConnectionState !== 'completed') {
              this.close();
            }
        }, this.timeToConnect);

        peerConnection.addEventListener('iceconnectionstatechange', this.onIceConnectionStateChange);
    }

    onIceConnectionStateChange() {
        let reconnectionTimer: any = null;
        if (this.peerConnection.iceConnectionState === 'connected'
          || this.peerConnection.iceConnectionState === 'completed') {
          if (this.connectionTimer) {
            this.options.clearTimeout(this.connectionTimer);
            this.connectionTimer = null;
          }
          this.options.clearTimeout(reconnectionTimer);
          reconnectionTimer = null;
        } else if (this.peerConnection.iceConnectionState === 'disconnected'
          || this.peerConnection.iceConnectionState === 'failed') {
          if (!this.connectionTimer && !reconnectionTimer) {
            const self = this;
            reconnectionTimer = this.options.setTimeout(() => {
              self.close();
            }, this.timeToReconnect);
          }
        }
    }

    async doOffer() {
        const offer = await this.peerConnection.createOffer();
        await this.peerConnection.setLocalDescription(offer);
        try {
            await this.waitUntilIceGatheringStateComplete(this.peerConnection, this.options);
        } catch (error) {
            this.close();
            throw error;
        }
    }

    async applyAnswer(answer: any) {
        await this.peerConnection.setRemoteDescription(answer);
    }
}
