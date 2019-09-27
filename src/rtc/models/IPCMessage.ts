export interface IPCMessage<T = any> {
    type: string;
    data?: T;
}

export interface RTCSessionDescriptionOffer {
    localDescription: RTCSessionDescription | null;
    id: string;
}
