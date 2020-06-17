import {Event} from "./event-interface";
import {Topics} from "../topics";

export enum Verdict {
  danger = 'danger',
  safe = 'safe',
}

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
