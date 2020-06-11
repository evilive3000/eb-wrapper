import {Message, PubSub, Subscription, SubscriptionOptions, Topic} from '@google-cloud/pubsub';
import {GoogleAuth} from 'google-auth-library';

const createPubSub = (() => {
  const auth = new GoogleAuth();
  const client = new PubSub({auth});
  return () => client;
})();

// export interface EventBusOptions {
//   client?: PubSub;
// }

export class EventBus {
  private static instance: EventBus;
  private client: PubSub;
  private subscriptions = new Map<string, Subscription>();
  private topics = new Map<string, Topic>();

  // constructor(options?: EventBusOptions) {
  //   this.client = options?.client || createPubSub();
  // }
  private constructor() {
    this.client = createPubSub();
  }

  private static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }

    return EventBus.instance;
  }

  static on(subscriptionName: string, handler: (msg: Message) => Promise<any>): void {
    const bus = EventBus.getInstance();
    let subscription = bus.subscriptions.get(subscriptionName);

    if (!subscription) {
      const subscriptionOptions: SubscriptionOptions = {};
      subscription = bus.client.subscription(subscriptionName, subscriptionOptions);
      bus.subscriptions.set(subscriptionName, subscription);
    }

    subscription.on('message', (msg: Message) => {
      handler(msg)
        .then((res) => (res === false ? msg.nack() : msg.ack()))
        .catch(console.error);
    });
  }

  static async dispatch(topicName: string, message: string): Promise<string> {
    const bus = EventBus.getInstance();
    let topic = bus.topics.get(topicName);

    if (!topic) {
      topic = bus.client.topic(topicName);
      bus.topics.set(topicName, topic);
    }

    const dataBuffer = Buffer.from(message);
    return topic.publish(dataBuffer);
  }
}
