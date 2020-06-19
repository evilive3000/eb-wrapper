import {Message, PubSub, Subscription} from "@google-cloud/pubsub";
import {Event} from './events'

export abstract class Listener<E extends Event> {
  abstract subscriptionName: string;

  protected constructor() {
  }

  protected handleError(err: Error, msg: Message) {
    console.error({err, data: msg.data.toString()});
  }

  abstract onMessage(data: E['data'], done: (err?: any) => any): void;

  parseMessage(msg: Message): E['data'] {
    const {data} = msg;
    return JSON.parse(data.toString('utf-8'));
  }

  listen(client: PubSub): Subscription {
    const subscription = client.subscription(this.subscriptionName);
    return subscription.on('message', (msg: Message) => {
      try {
        const data = this.parseMessage(msg);
        this.onMessage(data, (err) => err ? this.handleError(err, msg) : msg.ack());
      } catch (e) {
        // todo: отправлять ошибки в отдельный топик
        this.handleError(e, msg);
        msg.ack();
      }
    });
  }
}
