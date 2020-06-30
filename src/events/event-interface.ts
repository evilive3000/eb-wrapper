import {Topics} from "../topics";

export interface PubSubEvent {
  readonly topic: Topics;
  readonly data: unknown;

  toBuffer(): Buffer;
}
