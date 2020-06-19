import {Event} from "./event-interface";
import {Topics} from "../topics";

export class MediaUpdatedEvent implements Event {
  topic = Topics.MediaUpdated;
  data: {
    id: string;
    changed: Record<string, any>;
    doc: Record<string, any>;
  };

  constructor(id: string, changed: Record<string, any>, doc: Record<string, any>) {
    this.data = {id, changed, doc}
  }

  toBuffer(): Buffer {
    return Buffer.from(JSON.stringify(this.data));
  }
}
