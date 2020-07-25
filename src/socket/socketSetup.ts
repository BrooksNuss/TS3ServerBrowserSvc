import { TeamSpeak } from 'ts3-nodejs-library';
import { mapClientToResponse, mapChannelToResponse } from '../util/ModelMappers';
import { ServerStateService } from '../cache/serverState.service';
import { SocketServerService } from './socketServer.service';
import { ClientResponse, ChannelResponse } from 'models/response/TSResponses';

/**
 * Helper funciton for setting up TeamSpeak event listeners
 * @param ts3 TS3 server object
 * @param socketServerService websocket server service
 * @param serverStateService service for handling server state
 */
export function setupTSListeners(ts3: TeamSpeak, serverStateService: ServerStateService, socketServerService: SocketServerService) {
    ts3.on('clientconnect', event => {
        const client = serverStateService.connectClient(event.client);
        socketServerService.socketEmit<ClientResponse>('clientconnect', mapClientToResponse(client));
    });

    ts3.on('clientdisconnect', event => {
        serverStateService.disconnectClient(event.client);
        socketServerService.socketEmit<ClientResponse>('clientdisconnect', {clid: event.client.clid});
    });

    ts3.on('clientmoved', event => {
        const client = serverStateService.moveClient(event.client);
        socketServerService.socketEmit<ClientResponse>('clientmoved', mapClientToResponse(client));
    });

    ts3.on('serveredit', event => {
        // serverStateService.serverEdit(event);
        // socketServer.emit('serveredit', event);
    });

    ts3.on('channeledit', event => {
        const channel = serverStateService.channelEdit(event.channel);
        // maybe include the invoker for some of these, it exists on event
        socketServerService.socketEmit<ChannelResponse>('channeledit', mapChannelToResponse(channel));
    });

    ts3.on('channelcreate', event => {
        const channel = serverStateService.createChannel(event.channel);
        socketServerService.socketEmit<ChannelResponse>('channelcreate', mapChannelToResponse(channel));
    });

    ts3.on('channelmoved', event => {
        const channel = serverStateService.moveChannel(event.channel);
        socketServerService.socketEmit<ChannelResponse>('channelmoved', mapChannelToResponse(channel));
    });

    ts3.on('channeldelete', event => {
        serverStateService.deleteChannel(event.cid);
        socketServerService.socketEmit<ChannelResponse>('channeldelete', {cid: event.cid});
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
