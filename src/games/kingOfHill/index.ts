import config from "./config";
import Setup from "./Setup.vue";
import Game from "./Game.vue";
import {markRaw} from "vue";

export default {
  name: 'Царь горы',
  config,
  setup: markRaw(Setup),
  game: markRaw(Game),
  state: (config: config) => {
   return {
     ...config,
     teams: [...new Array(config.teams)].map(() => ({
       minutes: config.minutes,
       seconds: config.seconds,
     })),
     started: false,
     end: false
   }
  }
}
