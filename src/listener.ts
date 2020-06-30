import {Message, PubSub, Subscription} from "@google-cloud/pubsub";
import {PubSubEvent} from './events'
import {ErrorCaughtEvent} from "./events/error-caught";
import {EventBus} from "./event-bus";

export abstract class Listener<E extends PubSubEvent> {
  abstract subscriptionName: string;

  protected constructor() {}

  protected onError(err: any, msg: Message): void {
    EventBus.publish(new ErrorCaughtEvent(err, msg, this)).catch(console.error)
    console.error({err, msg});
  }

  abstract async onMessage(data: E['data']): Promise<any>;

  async parseMessage(msg: Message): Promise<E['data']> {
    const {data} = msg;
    return Promise.resolve(JSON.parse(data.toString('utf-8')));
  }

  listen(client: PubSub): Subscription {
    const subscription = client.subscription(this.subscriptionName);

    return subscription.on('message', (msg: Message) => {
      this.parseMessage(msg)
        .then(data => this.onMessage(data))
        .catch(err => this.onError(err, msg))
        .finally(() => msg.ack())
    });
  }
}
