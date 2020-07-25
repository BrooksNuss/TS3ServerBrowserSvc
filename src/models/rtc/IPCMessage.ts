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
    DISCONNECT = 'DISCONNECT',
    JOIN_CHANNEL = 'JOIN_CHANNEL',
    TOGGLE_MUTE_INPUT = 'TOGGLE_MUTE_INPUT',
    TOGGLE_MUTE_OUTPUT = 'TOGGLE_MUTE_OUTPUT'
}
