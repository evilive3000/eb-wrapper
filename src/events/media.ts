import {PubSubEvent} from "./pubsub-event";
import {Topics} from "../topics";

abstract class MediaEvent<T extends object = Record<string, any>> extends PubSubEvent {
  abstract readonly topic: Topics;

  data: {
    id: string
    doc: T
  };

  constructor(id: string, doc: T) {
    super();
    this.data = {id, doc}
  }
}

export class MediaDeletedEvent extends MediaEvent {
  topic = Topics.MediaDeleted;
}

export class MediaUpdateEvent extends MediaEvent {
  topic = Topics.MediaUpdated;
}
