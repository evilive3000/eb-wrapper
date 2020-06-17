import {Topics} from "../topics";

export interface Event {
  readonly topic: Topics;
  readonly data: unknown;

  toBuffer(): Buffer;
}
