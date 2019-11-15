export type AwayStatus = 'ACTIVE' | 'INACTIVE' | 'AWAY' | 'OFFLINE';

export interface ClientStatus {
    clientDBId: number;
    status: AwayStatus;
}
