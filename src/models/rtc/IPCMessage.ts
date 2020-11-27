export interface IPCMessage<T = any> {
    type: IPCMessageDataType;
    clid?: string;
    data?: T;
}

// export interface IPCMessageData {
//     clid: string;
// }

export interface IPCMessageConnect {
    identity: string;
    clientName: string;
    channel: string;
    channelPassword: string;
    id: string;
}

// no disconnect interface needed, just clid

export interface IPCMessageJoinChannel {
    cid: string;
}

export interface IPCMessageVoice {
    buffer: Buffer;
}

export enum IPCMessageDataType {
    CONNECT = 0,
    DISCONNECT = 1,
    JOIN_CHANNEL = 2,
    TOGGLE_MUTE_INPUT = 3,
    TOGGLE_MUTE_OUTPUT = 4,
    VAD_ACTIVE = 5,
    VAD_INACTIVE = 6,
    SEND_VOICE = 7,
    RECEIVE_VOICE = 8,
    MUTE_CLIENT_LOCALLY = 9,
    TALKING_CLIENT = 10,
    CLIENT_ID = 11
}

export interface RTCSessionDescriptionOffer {
    localDescription: RTCSessionDescription | null;
    id: string;
}
