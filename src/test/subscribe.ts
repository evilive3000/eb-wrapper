import {Listener} from "../listener";
import {ebus} from "../event-bus";
import {Topics} from "../topics";
import {ErrorCaughtEvent} from "../events/error-caught";
import {MediaUpdatedEvent} from "../events";

class ErrorListener extends Listener<ErrorCaughtEvent> {
  topic = Topics.ErrorCaught;
  groupName = 'huemoe';

  async onMessage(data: ErrorCaughtEvent["data"]): Promise<any> {
    console.log({data})
  }
}

class CustomListener extends Listener<MediaUpdatedEvent> {
  topic = Topics.MediaSafetyUpdated;
  groupName = 'test-subs';

  async onMessage(data: MediaUpdatedEvent["data"]): Promise<any> {
    // if (Math.random() > 0.75)
    //   throw new Error('Event Error Occurred')
    console.log({data})
  }
}

ebus.connect({
  clientId: process.env.CLIENT_ID!,
  clusterId: process.env.CLUSTER_ID!,
  url: process.env.URL!
}).then(() => {

  ebus.subscribe(new ErrorListener())
  ebus.subscribe(new CustomListener())

}).catch(console.error)

