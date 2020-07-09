import {Message} from "node-nats-streaming";
import {PubSubEvent} from "./pubsub-event";
import {Topics} from "../topics";
import {Listener} from "../listener";

export class ErrorCaughtEvent implements PubSubEvent {
  topic = Topics.ErrorCaught;
  data: {
    error: string;
    publishTime: string;
    data: string;
    subscription: string;
  }

  constructor(err: any, msg: Message, listener: Listener<any>) {
    this.data = {
      subscription: listener.groupName,
      publishTime: msg.getTimestamp().toISOString(),
      data: msg.getData().toString(),
      error: err.message || JSON.stringify(err),
    }
  }

  toBuffer(): Buffer {
    return Buffer.from(JSON.stringify(this.data));
  }
}
