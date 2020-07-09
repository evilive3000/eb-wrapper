import {PubSubEvent} from "./pubsub-event";
import {Topics} from "../topics";

export class MediaSafetyUpdatedEvent extends PubSubEvent {
  topic = Topics.MediaSafetyUpdated;
  data: {
    id: string;
    verdict: 'safe' | 'danger'
  }

  constructor(id: string, verdict: 'safe' | 'danger') {
    super();
    this.data = {id, verdict}
  }
}
