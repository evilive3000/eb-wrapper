import {Message, PubSub, Subscription} from "@google-cloud/pubsub";
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

  listen(client: PubSub): Subscription {
    const subscription = client.subscription(this.subscriptionName);
    return subscription.on('message', (msg: Message) => {
      try {
        const data = this.parseMessage(msg);
        this.onMessage(data, msg);
      } catch (e) {
        // todo: отправлять ошибки в отдельный топик
        console.error({e, data: msg.data.toString()});
        msg.ack();
      }
    });
  }
}
