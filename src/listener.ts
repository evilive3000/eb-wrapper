import {PubSubEvent} from './events'
import {ErrorCaughtEvent} from "./events/error-caught";
import {Message, Stan, Subscription} from "node-nats-streaming";
import {Topics} from "./topics";
import {ebus} from "./event-bus";

export abstract class Listener<E extends PubSubEvent> {
  abstract topic: Topics;
  abstract groupName: string;
  protected ackWait = 5 * 1000;

  async parseMessage(msg: Message): Promise<E['data']> {
    const data = msg.getData();

    return Promise.resolve(
      JSON.parse(
        typeof data === 'string'
          ? data
          : data.toString('utf-8'))
    );
  }

  abstract async onMessage(data: E['data']): Promise<any>;

  protected onError(err: any, msg: Message): void {
    ebus
      .publish(new ErrorCaughtEvent(err, msg, this))
      .catch(console.error)

    console.error({err, msg});
  }

  listen(client: Stan): Subscription {
    const subscription = client.subscribe(
      this.topic,
      this.groupName,
      client.subscriptionOptions()
        .setDeliverAllAvailable()
        .setManualAckMode(true)
        .setAckWait(this.ackWait)
        .setDurableName(this.groupName)
        .setMaxInFlight(1)
    )

    return subscription.on('message', (msg: Message) => {
      this.parseMessage(msg)
        .then(data => this.onMessage(data))
        .catch(err => this.onError(err, msg))
        .finally(() => msg.ack())
    });
  }
}
