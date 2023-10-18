import config from "./config";
import Setup from "./Setup.vue";
import Game from "./Game.vue";
import {markRaw} from "vue";

export default {
  name: 'Командный бой',
  config,
  setup: markRaw(Setup),
  game: markRaw(Game),
  state: (config: config) => {
   return {
     teams: [...new Array(config.teams)].map(() => ({
       teamHealth: config.teamHealth
     })),
     started: false,
     end: false
   }
  }
}
