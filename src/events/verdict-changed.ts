import {Event} from "./event-interface";
import {Topics} from "../topics";

type Verdict = 'danger' | 'safe';

export class VerdictChangedEvent implements Event {
  topic = Topics.VerdictChanged;
  data: {
    mediaId: string;
    verdict: Verdict
  }

  constructor(mediaId: string, verdict: Verdict) {
    this.data = {mediaId, verdict}
  }

  toBuffer(): Buffer {
    return Buffer.from(JSON.stringify(this.data));
  }
}
