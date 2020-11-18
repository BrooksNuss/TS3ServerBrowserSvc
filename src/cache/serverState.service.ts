import { TeamSpeakClient } from 'ts3-nodejs-library/lib/node/Client';
import { TeamSpeakChannel } from 'ts3-nodejs-library/lib/node/Channel';
import { TeamSpeakServerGroup } from 'ts3-nodejs-library/lib/node/ServerGroup';
import { TeamSpeakChannelGroup } from 'ts3-nodejs-library/lib/node/ChannelGroup';
import { ts3 } from '../app';
import { ClientList } from 'ts3-nodejs-library/lib/types/ResponseTypes';
import { Client } from 'models/business/Client';
import { Channel } from 'models/business/Channel';
import { ServerGroup } from 'models/business/ServerGroup';
import { ChannelGroup } from 'models/business/ChannelGroup';
import { mapTSClientToBusiness, mapTSChannelToBusiness, mapTSServerGroupToBusiness, mapTSChannelGroupToBusiness } from 'util/ModelMappers';
import { ServerBrowserCacheService } from './serverBrowserCache.service';

export class ServerStateService {
    public dbClients: Map<number, TeamSpeakClient> = new Map<number, TeamSpeakClient>();
    public dbChannels: Map<number, TeamSpeakChannel> = new Map<number, TeamSpeakChannel>();
    public dbServerGroups: Map<number, TeamSpeakServerGroup> = new Map<number, TeamSpeakServerGroup>();
    public dbChannelGroups: Map<number, TeamSpeakChannelGroup> = new Map<number, TeamSpeakChannelGroup>();
    public clients: Map<number, Client> = new Map<number, Client>();
    public channels: Map<number, Channel> = new Map<number, Channel>();
    public serverGroups: Map<number, ServerGroup> = new Map<number, ServerGroup>();
    public channelGroups: Map<number, ChannelGroup> = new Map<number, ChannelGroup>();

    constructor(private fileCacheService: ServerBrowserCacheService) {
        this.fileCacheService = fileCacheService;
    }

    // we need our own business models here instead of using the ts3 models
    public initializeState() {
        ts3.clientList({client_type: 0}).then(clientList => {
            if (clientList) {
                clientList.forEach(async client => {
                    this.dbClients.set(client.databaseId, client);
                    const clientModel = mapTSClientToBusiness(client);
                    this.clients.set(client.databaseId, clientModel);
                    // monitor startup performance
                    const avatar = await this.fileCacheService.getAvatarByClient(client);
                    clientModel.avatar = avatar.avatarBuffer;
                    clientModel.avatarGuid = avatar.avatarGUID;
                });
            } else {
                console.error('Could not retrieve TS client list');
            }
        });
        ts3.channelList().then(channelList => {
            if (channelList) {
                channelList.forEach(channel => {
                    this.dbChannels.set(channel.cid, channel);
                    this.channels.set(channel.cid, mapTSChannelToBusiness(channel));
                });
            } else {
                console.error('Could not retrieve TS channel list');
            }
        });
        ts3.serverGroupList({type: 1}).then(serverGroupList => {
            if (serverGroupList) {
                serverGroupList.forEach(async serverGroup => {
                    this.dbServerGroups.set(serverGroup.sgid, serverGroup);
                    const group = mapTSServerGroupToBusiness(serverGroup);
                    this.serverGroups.set(serverGroup.sgid, group);
                    // monitor startup performance
                    group.icon = await this.fileCacheService.getGroupIconByGroupId(serverGroup, 'server');
                });
            } else {
                console.error('Could not retrieve TS server group list');
            }
        });
        ts3.channelGroupList({type: 1}).then(channelGroupList => {
            if (channelGroupList) {
                channelGroupList.forEach(async channelGroup => {
                    this.dbChannelGroups.set(channelGroup.cgid, channelGroup);
                    const group = mapTSChannelGroupToBusiness(channelGroup);
                    this.channelGroups.set(channelGroup.cgid, group);
                    // monitor startup performance
                    group.icon = await this.fileCacheService.getGroupIconByGroupId(channelGroup, 'channel');
                });
            } else {
                console.error('Could not retrieve TS channel group list');
            }
        });
    }

    public connectClient(client: TeamSpeakClient): Client {
        // this.dbClients.set(client.databaseId, client);
        const c = mapTSClientToBusiness(client);
        this.clients.set(c.databaseId, c);
        return c;
    }

    public disconnectClient(client: ClientList): void {
        // this.dbClients.delete(client.client_database_id);
        this.clients.delete(client.client_database_id);
    }

    public moveClient(client: TeamSpeakClient): Client {
        // this.dbClients.set(clientMoveEvent.client.databaseId, clientMoveEvent.client);
        let c = this.clients.get(client.databaseId);
        if (c) {
            c.cid = client.cid;
        } else {
            c = mapTSClientToBusiness(client);
            this.clients.set(c.clid, c);
        }
        return c;
    }

    // public serverEdit(serverEditEvent: ServerEdit): void {

    // }

    public channelEdit(channel: TeamSpeakChannel): Channel {
        // this.dbChannels.set(channelEditEvent.channel.cid, channelEditEvent.channel);
        const channelModel = mapTSChannelToBusiness(channel);
        let c = this.channels.get(channelModel.cid);
        if (c) {
            c.updateFields(channelModel);
        } else {
            c = channelModel;
        }
        return c;
    }

    public createChannel(channel: TeamSpeakChannel): Channel {
        // this.dbChannels.set(channel.cid, channel);
        const c = mapTSChannelToBusiness(channel);
        this.channels.set(c.cid, c);
        return c;
    }

    public moveChannel(channel: TeamSpeakChannel): Channel {
        // this.dbChannels.set(channel.cid, channel);
        let c = this.channels.get(channel.cid);
        if (c) {
            c.pid = channel.pid;
        } else {
            c = mapTSChannelToBusiness(channel);
            this.channels.set(c.cid, c);
        }
        return c;
    }

    public deleteChannel(cid: number): void {
        // this.dbChannels.delete(cid);
        this.channels.delete(cid);
    }
}
