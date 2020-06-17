import {PubSub, Topic} from "@google-cloud/pubsub";
import {Event} from "./events/event-interface";
import {Listener} from "./listener";
import {PublishOptions} from "@google-cloud/pubsub/build/src/publisher";

const mapGetSetDefault = <T>(hmap: Map<any, T>, key: any, def: () => T): T => {
  if (!hmap.has(key)) {
    hmap.set(key, def())
  }
  return hmap.get(key)!;
}

export class EventBus {
  private static instance: EventBus;
  private client: PubSub;
  private topics = new Map<string, Topic>();

  private constructor() {
    this.client = new PubSub(/*{auth: new GoogleAuth()}*/);
  }

  private static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }

    return EventBus.instance;
  }

  static async publish(event: Event): Promise<any> {
    const bus = EventBus.getInstance();
    // todo: options
    const options: PublishOptions = {};

    const topic = mapGetSetDefault(
      bus.topics,
      event.topic,
      () => bus.client.topic(event.topic, options)
    )

    return topic.publish(event.toBuffer());
  }

  static subscribe(listeners: Listener<Event>[]): void {
    const bus = EventBus.getInstance();
    listeners.forEach(listener => {
      listener.listen(bus.client);
    })
  }
}
