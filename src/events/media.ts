import {PubSubEvent} from "./pubsub-event";
import {Topics} from "../topics";

type Media = {
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

export class MediaCreatedEvent extends MediaEvent {
  readonly topic = Topics.MediaCreated;
}

export class MediaDeletedEvent extends MediaEvent {
  readonly topic = Topics.MediaDeleted;
}

export class MediaUpdatedEvent extends MediaEvent {
  readonly topic = Topics.MediaUpdated;
}
