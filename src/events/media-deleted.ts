import {PubSubEvent} from "./event-interface";
import {Topics} from "../topics";

export class MediaDeletedEvent implements PubSubEvent {
  topic = Topics.MediaDeleted;
  data: { id: string; };

  constructor(id: string) {
    this.data = {id}
  }

  toBuffer(): Buffer {
    return Buffer.from(JSON.stringify(this.data));
  }
}
