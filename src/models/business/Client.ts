export class Client {
    constructor(
        public clid = 0,
        public cid = 0,
        public databaseId = 0,
        public nickname = '',
        public serverGroupIds?: number[],
        public channelGroupId?: number,
        public away?: boolean,
        public idleTime?: number,
        public avatarGuid?: string,
        public avatar?: string
    ) { }
}
