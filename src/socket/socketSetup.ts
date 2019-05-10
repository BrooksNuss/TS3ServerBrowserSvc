/**
 * Helper funciton for setting up TeamSpeak event listeners
 * @param ts3 TS3 server object
 * @param socketServer websocket server
 */
export function setupTSListeners(ts3: TeamSpeak3, socketServer: SocketIO.Server) {
    const standardEvents = [
      'clientconnect',
      'clientdisconnect',
      'clientmoved',
      'serveredit',
      'channeledit',
      'channelcreate',
      'channelmoved',
      'channeldelete'
    ];

    standardEvents.forEach(eventType => {
        ts3.on(eventType, event => {
            console.log('SOCKET EVENT: ' + eventType);
            console.log(event);
            socketServer.emit(eventType, event);
        });
    });

    // ts3.on('clientconnect', event => {
    //     console.log(event);
    // });
}

export function registerTSEvents(ts3: TeamSpeak3) {
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
