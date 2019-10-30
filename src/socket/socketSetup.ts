import { TeamSpeak } from 'ts3-nodejs-library';

/**
 * Helper funciton for setting up TeamSpeak event listeners
 * @param ts3 TS3 server object
 * @param socketServer websocket server
 */
export function setupTSListeners(ts3: TeamSpeak, socketServer: SocketIO.Server) {
    ts3.on('clientconnect', event => {
        socketServer.emit('clientconnect', event);
    });

    ts3.on('clientdisconnect', event => {
        socketServer.emit('clientdisconnect', event);
    });

    ts3.on('clientmoved', event => {
        socketServer.emit('clientmoved', event);
    });

    ts3.on('serveredit', event => {
        socketServer.emit('serveredit', event);
    });

    ts3.on('channeledit', event => {
        socketServer.emit('channeledit', event);
    });

    ts3.on('channelcreate', event => {
        socketServer.emit('channelcreate', event);
    });

    ts3.on('channelmoved', event => {
        socketServer.emit('channelmoved', event);
    });

    ts3.on('channeldelete', event => {
        socketServer.emit('channeldelete', event);
    });
}

export function registerTSEvents(ts3: TeamSpeak) {
    Promise.all([
        ts3.registerEvent('server'),
        ts3.registerEvent('channel', 0),
        ts3.registerEvent('textserver'),
        ts3.registerEvent('textchannel'),
        ts3.registerEvent('textprivate')
    ]).then(value => {
        console.log('Server is now subscribed to events');
    }).catch(e => {
        console.log('error subbing');
        console.log(e);
    });
}
