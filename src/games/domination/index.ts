import config from "./config";
import Setup from "./Setup.vue";
import Game from "./Game.vue";
import {markRaw} from "vue";

export default {
  name: 'Доминирование',
  config,
  setup: markRaw(Setup),
  game: markRaw(Game),
  state: (config: config) => {
   return {
     ...config,
     teams: config.teams.map((team) => ({
       ...team,
       points: 0,
     })),
     started: false,
     end: false
   }
  }
}
