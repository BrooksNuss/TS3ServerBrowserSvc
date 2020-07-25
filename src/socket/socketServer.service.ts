export class SocketServerService {
    private socketServer: SocketIO.Server;

    constructor(socketServer: SocketIO.Server) {
        this.socketServer = socketServer;
    }

    public socketEmit<T>(type: string, event: T): void {
        this.socketServer.emit(type, event);
    }
}
