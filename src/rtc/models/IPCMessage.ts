export interface IPCMessage<T = any> {
    type: string;
    data?: T;
}

export interface RTCSessionDescriptionOffer {
    localDescription: RTCSessionDescription | null;
    id: string;
}

export enum TSCommand {
    SEND_AUDIO = 0,
    DISCONNECT,
    MOVE_CLIENT,
    MUTE_INPUT,
    MUTE_OUTPUT
}
