export class Connection extends EventEmitter {
    public id: string;
    public state: string;

    constructor(id: string) {
      super();
      this.id = id;
      this.state = 'open';
    }

    public close(): void {
      this.state = 'closed';
      this.emit('closed');
    }

    public toJSON(): {id: string, state: string} {
      return {
        id: this.id,
        state: this.state,
      };
    }
}
