export class Channel {
    constructor(
        public cid = 0,
        public name = '',
        public pid = 0,
        public topic?: string,
        public description?: string,
        public passworded?: boolean
    ) { }

    public updateFields(newChannel: Channel): void {
        this.name = newChannel.name;
        this.topic = newChannel.topic;
        this.description = newChannel.description;
        this.passworded = newChannel.passworded;
    }
}
