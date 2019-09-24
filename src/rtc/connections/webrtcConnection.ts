import { IPCMessage, RTCSessionDescriptionOffer } from '../models/IPCMessage';

const WebRTCPeerConnection = require('wrtc').RTCPeerConnection;
const EventEmitter = require('events');

export class WebRtcConnection extends EventEmitter {
    public id: string;
    public state: string;
    private timeToConnect = 10000;
    private timeToHostCandidates = 3000;
    private timeToReconnect = 10000;
    public peerConnection: webkitRTCPeerConnection;
    private reconnectTimer: NodeJS.Timeout | null;
    private connectTimer: NodeJS.Timeout | null;
    private get iceConnectionState() {
        return this.peerConnection.iceConnectionState;
    }
    private get localDescription() {
        return this.descriptionToJSON(this.peerConnection.localDescription, true);
    }
    private get remoteDescription() {
        return this.descriptionToJSON(this.peerConnection.remoteDescription, false);
    }
    private get signalingState() {
        return this.peerConnection.signalingState;
    }

    constructor(id: string) {
        super();
        this.id = id;
        this.state = 'open';
        this.peerConnection = new WebRTCPeerConnection({
            sdpSemantics: 'unified-plan',
            iceServers: [{
                urls: [
                'stun:stun.l.google.com:19302',
                'stun:stun1.l.google.com:19302'
                ]
            }]
        });
        this.connectTimer = setTimeout(() => {
            if (this.peerConnection.iceConnectionState !== 'connected'
                && this.peerConnection.iceConnectionState !== 'completed') {
                this.close();
            }
        }, this.timeToConnect);
        this.reconnectTimer = null;
        this.peerConnection.addEventListener('iceconnectionstatechange', this.onIceConnectionStateChange);
    }

    private onIceConnectionStateChange = () => {
        if (this.peerConnection.iceConnectionState === 'connected'
            || this.peerConnection.iceConnectionState === 'completed') {
            if (this.connectTimer) {
                clearTimeout(this.connectTimer);
                this.connectTimer = null;
            }
            if (this.reconnectTimer) {
                clearTimeout(this.reconnectTimer);
                this.reconnectTimer = null;
            }
        } else if (this.peerConnection.iceConnectionState === 'disconnected'
            || this.peerConnection.iceConnectionState === 'failed') {
            if (!this.connectTimer && !this.reconnectTimer) {
                const self = this;
                this.reconnectTimer = setTimeout(() => {
                    self.close();
                }, this.timeToReconnect);
            }
        }
    }

    async doOffer() {
        const offer = await this.peerConnection.createOffer({offerToReceiveAudio: true});
        if (offer.sdp) {
            offer.sdp = offer.sdp.replace('a=fmtp:111', 'a=fmtp:111 stereo=0; sprop-stereo=0;');
        }
        await this.peerConnection.setLocalDescription(offer);
        try {
            await this.waitUntilIceGatheringStateComplete();
            if (process.send) {
                const msg: IPCMessage<RTCSessionDescriptionOffer> = {type: 'doOffer', data: {localDescription: offer, id: this.id}};
                process.send(msg);
            }
        } catch (error) {
            this.close();
            if (process.send) {
                const msg: IPCMessage<RTCSessionDescriptionInit> = {type: 'error', data: error};
                process.send(msg);
            }
        }
    }

    async applyAnswer(answer: RTCSessionDescriptionInit) {
        try {
            await this.peerConnection.setRemoteDescription(answer);
            if (process.send) {
                process.send({type: 'answer', data: this.remoteDescription} as IPCMessage<RTCSessionDescriptionInit>);
            }
        } catch (error) {
            if (process.send) {
                process.send({type: 'error', data: error} as IPCMessage);
            }
        }
    }

    close() {
        this.peerConnection.removeEventListener('iceconnectionstatechange', this.onIceConnectionStateChange);
        if (this.connectTimer) {
            clearTimeout(this.connectTimer);
            this.connectTimer = null;
        }
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
        }
        this.peerConnection.close();
        this.state = 'closed';
        this.emit('closed');
    }

    toJSON() {
        return {
            id: this.id,
            state: this.state,
            iceConnectionState: this.iceConnectionState,
            localDescription: this.localDescription,
            remoteDescription: this.remoteDescription,
            signalingState: this.signalingState,
        };
    }

    descriptionToJSON(description: RTCSessionDescription | null, shouldDisableTrickleIce: boolean) {
        return !description ? {} : {
            type: description.type,
            sdp: shouldDisableTrickleIce ? this.disableTrickleIce(description.sdp) : description.sdp,
        };
    }

    disableTrickleIce(sdp: string) {
        return sdp.replace(/\r\na=ice-options:trickle/g, '');
    }

    async waitUntilIceGatheringStateComplete() {
        if (this.peerConnection.iceGatheringState === 'complete') {
            return;
        }
        let resolve: () => void;
        let reject: () => void;
        let timeout: NodeJS.Timeout;
        const promise = new Promise((res, rej) => {
            resolve = res;
            reject = rej;
        });
        const onIceCandidate = (e: RTCPeerConnectionIceEvent) => {
            if (!e.candidate) {
                clearTimeout(timeout);
                this.peerConnection.removeEventListener('icecandidate', onIceCandidate);
                resolve();
            }
        };
        timeout = setTimeout(() => {
            this.peerConnection.removeEventListener('icecandidate', onIceCandidate);
            Promise.reject(new Error('Timed out waiting for host candidates'));
        }, this.timeToHostCandidates);
        console.log(this.peerConnection.connectionState);
        this.peerConnection.addEventListener('icecandidate', onIceCandidate);

        await promise;
    }
}
