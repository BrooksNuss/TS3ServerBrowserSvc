export class Connection extends EventEmitter {
  public id: string;
  public state: 'open' | 'closed';

  constructor(id: string) {
    super();
    this.id = id;
    this.state = 'open';
  }

  toJSON() {
    return {
      id: this.id,
      state: this.state
    };
  }
}
