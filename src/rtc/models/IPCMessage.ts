export interface IPCMessage<T = any> {
    type: string;
    data?: T;
}

export interface RTCSessionDescriptionOffer {
    localDescription: RTCSessionDescriptionInit;
    id: string;
}
