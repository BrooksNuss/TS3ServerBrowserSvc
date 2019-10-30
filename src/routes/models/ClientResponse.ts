import { TeamSpeakClient } from 'ts3-nodejs-library/lib/node/Client';

export interface ClientResponse {
    client: TeamSpeakClient;
    avatar: Buffer | null;
}
