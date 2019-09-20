export interface IPCMessage<T = string> {
    type: string;
    data?: T;
}
