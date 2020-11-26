import { IPCMessage, RTCSessionDescriptionOffer } from '../../models/rtc/IPCMessage';

const WebRTCPeerConnection = require('wrtc').RTCPeerConnection;
const EventEmitter = require('events');

export class WebRtcConnection extends EventEmitter {
    public id: string;
    public state: string;
    private timeToConnect = 10000;
    private timeToHostCandidates = 5000;
    private timeToReconnect = 10000;
    public peerConnection: RTCPeerConnection;
    private reconnectTimer: NodeJS.Timeout | null;
    private connectTimer: NodeJS.Timeout | null;
    private get iceConnectionState() {
        return this.peerConnection.iceConnectionState;
    }
    private get localDescription() {
        return this.descriptionToJSON(this.peerConnection.localDescription, false);
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
        this.peerConnection.addTransceiver('audio');
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

    async doOffer(): Promise<RTCSessionDescriptionInit> {
        const offer = await this.peerConnection.createOffer();
        await this.peerConnection.setLocalDescription(offer);
        try {
            await this.waitUntilIceGatheringStateComplete();
            if (!this.localDescription) {
                return Promise.reject();
            }
            return this.localDescription;
        } catch (error) {
            this.close();
            return Promise.reject(error);
        }
    }

    async applyAnswer(answer: RTCSessionDescriptionInit) {
        try {
            await this.peerConnection.setRemoteDescription(answer);
            return this.remoteDescription as RTCSessionDescriptionInit;
        } catch (error) {
            return error;
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

    descriptionToJSON(description: RTCSessionDescription | null, shouldDisableTrickleIce: boolean): RTCSessionDescriptionInit | null {
        return !description ? null : {
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
        const minimumCandidates = 10;
        let candidatesFound = 0;
        const onIceCandidate = (e: RTCPeerConnectionIceEvent) => {
            candidatesFound++;
            if (!e.candidate) {
                clearTimeout(timeout);
                this.peerConnection.removeEventListener('icecandidate', onIceCandidate);
                resolve();
            }
        };
        // only gather for a short time, so the connection doesn't time out
        timeout = setTimeout(() => {
            if (candidatesFound > minimumCandidates) {
                this.peerConnection.removeEventListener('icecandidate', onIceCandidate);
                resolve();
            } else {
                Promise.reject(new Error('Timed out waiting for host candidates'));
            }
        }, this.timeToHostCandidates);
        console.log(this.peerConnection.connectionState);
        this.peerConnection.addEventListener('icecandidate', onIceCandidate);

        return promise;
    }
}
