export type AwayStatus = 'ACTIVE' | 'INACTIVE' | 'AWAY' | 'OFFLINE';

export interface ClientStatus {
    clid: number;
    status: AwayStatus;
}
