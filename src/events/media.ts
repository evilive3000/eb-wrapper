import {PubSubEvent} from "./pubsub-event";
import {Topics} from "../topics";

type Media = {
  id: string;
  tags: { tag: string }[];
  isSafe: boolean;
}

abstract class MediaEvent extends PubSubEvent {
  abstract readonly topic: Topics;

  data: {
    id: string
    doc: Media
  };

  constructor(id: string, doc: Media) {
    super();
    this.data = {id, doc}
  }
}

export class MediaDeletedEvent extends MediaEvent {
  topic = Topics.MediaDeleted;
}

export class MediaUpdatedEvent extends MediaEvent {
  topic = Topics.MediaUpdated;
}
