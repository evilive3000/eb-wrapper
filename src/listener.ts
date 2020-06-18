import {Message, PubSub} from "@google-cloud/pubsub";
import {Event} from './events'

export abstract class Listener<E extends Event> {
  abstract subscriptionName: string;

  protected constructor() {
  }

  abstract onMessage(data: E['data'], msg: Message): void;

  parseMessage(msg: Message): E['data'] {
    const {data} = msg;
    return JSON.parse(data.toString('utf-8'));
  }

  listen(client: PubSub) {
    const subscription = client.subscription(this.subscriptionName);
    subscription.on('message', (msg: Message) => {
      const data = this.parseMessage(msg);
      this.onMessage(data, msg);
    });
  }
}
