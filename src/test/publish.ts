import {ebus} from "../event-bus";
import {MediaUpdatedEvent} from "../../dist/events";

console.log(process.env.URL)

ebus.connect({
  clientId: process.env.CLIENT_ID!,
  clusterId: process.env.CLUSTER_ID!,
  url: process.env.URL!
}).then((close) => {

  return ebus.publish(
    new MediaUpdatedEvent(
      new Date().toISOString(),
      {
        googleSafe: 'safe',
        tags: []
      }
    )
  ).then(() => close())

})
  .then()
  .catch(console.error)



