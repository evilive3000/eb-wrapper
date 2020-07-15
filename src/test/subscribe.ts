import {Listener} from "../listener";
import {ebus} from "../event-bus";
import {Topics} from "../topics";
import {MediaCreatedEvent} from "../events";

class CustomListener extends Listener<MediaCreatedEvent> {
  readonly topic = Topics.MediaCreated;
  groupName = 'test';

  async onMessage(data: any): Promise<any> {
    // if (Math.random() > 0.75)
    //   throw new Error('Event Error Occurred')
    console.log({data})
  }
}

ebus.connect().then(() => {
  ebus.subscribe(new CustomListener())
}).catch(console.error)

