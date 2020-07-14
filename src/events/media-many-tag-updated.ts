import {PubSubEvent} from "./pubsub-event";
import {Topics} from "../topics";

export class MediaManyTagUpdated extends PubSubEvent {
  topic = Topics.MediaManyTagUpdated;
  data: {
    ids: string[];
    tag: string;
  }

  constructor(ids: string[], tag: string) {
    super();
    this.data = {ids, tag}
  }
}
