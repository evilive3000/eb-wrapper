import {Topics} from "../topics";

export abstract class PubSubEvent {
  abstract readonly topic: Topics;
  readonly data: unknown;

  toBuffer(): Buffer {
    return Buffer.from(JSON.stringify(this.data));
  }
}
