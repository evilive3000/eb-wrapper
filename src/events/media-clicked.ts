import {PubSubEvent} from "./pubsub-event";
import {Topics} from "../topics";

class MediaClickedEvent extends PubSubEvent {
  readonly topic = Topics.MediaClicked
  readonly data: {
    id: string;
    query: string;
  }

  constructor(mediaId: string, query: string) {
    super();
    this.data = {id: mediaId, query}
  }
}
