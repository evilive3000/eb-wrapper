import nats, {Stan, Subscription} from "node-nats-streaming";
import {Listener} from "./listener";
import {PubSubEvent} from './events'
import {randomBytes} from "crypto";
import Debug from "debug";

const debug = Debug('ebus')

export interface NatsConnectionOptions {
  clusterId?: string;
  clientId?: string;
  url?: string;
}

class EventBus {
  private _client: Stan | null = null;

  async connect(options: NatsConnectionOptions = {}) {
    const {
      clusterId = process.env.NATS_CID!,
      clientId = randomBytes(4).toString('hex'),
      url = process.env.NATS_URL!
    } = options;

    debug('nats connect: %o', {clusterId, clientId, url})
    const client = nats.connect(clusterId, clientId, {url})

    if (!clusterId || !url) {
      throw new Error("You must provide `clusterId` and `url`.")
    }

    return new Promise<() => void>((resolve, reject) => {
      client.on('connect', () => {
        debug('nats connected')
        this._client = client;
        resolve(() => client.close());
      });
      client.on('error', reject);
    })
  }

  get client(): Stan {
    if (this._client === null) {
      throw new Error('Can not access NATS client before connecting.');
    }

    return this._client;
  }

  async publish(event: PubSubEvent): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const guid = this.client.publish(
        event.topic,
        event.toBuffer(),
        (err, guid) => err ? reject(err) : resolve(guid)
      )
      debug('published to "%s"; guid: %s', event.topic, guid)
    })
  }

  subscribe(listener: Listener<PubSubEvent>): Subscription {
    debug('subscribe groupName: "%s"; topic: "%s"', listener.groupName, listener.topic)
    return listener.listen(this.client);
  }
}

export const ebus = new EventBus();
