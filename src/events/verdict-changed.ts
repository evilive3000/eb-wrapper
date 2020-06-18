import {Event} from "./event-interface";
import {Topics} from "../topics";

export class VerdictChangedEvent<V> implements Event {
  topic = Topics.VerdictChanged;
  data: {
    mediaId: string;
    verdict: V
  }

  constructor(mediaId: string, verdict: V) {
    this.data = {mediaId, verdict}
  }

  toBuffer(): Buffer {
    return Buffer.from(JSON.stringify(this.data));
  }
}
