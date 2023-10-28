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
       score: 0,
     })),
     points: config.points.map((point) => ({
       ...point,
       owner: -1,
     })),
     started: false,
     end: false
   }
  }
}
