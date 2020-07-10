import {ebus} from "../event-bus";
import {MediaUpdatedEvent} from "../events";

ebus.connect({
  clusterId: process.env.NATS_CID!,
  url: process.env.NATS_URL!
}).then((close) => {

  return ebus.publish(
    new MediaUpdatedEvent(
      new Date().toISOString(),
      {
        isSafe: true,
        tags: []
      }
    )
  ).then(() => close())

})
  .then()
  .catch(console.error)



