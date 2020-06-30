import {Message} from "@google-cloud/pubsub";
import {PubSubEvent} from "./event-interface";
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
      subscription: listener.subscriptionName,
      publishTime: msg.publishTime.toISOString(),
      data: msg.data.toString(),
      error: err.message || JSON.stringify(err),
    }
  }

  toBuffer(): Buffer {
    return Buffer.from(JSON.stringify(this.data));
  }
}
