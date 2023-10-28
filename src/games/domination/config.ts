import {IConfig} from "@/games";
import { cloneDeep } from "lodash-es";

export const defaultPoint = {
  name: 'Точка',
  cost: 10,
  captureTime: 10, // Время захвата
  accrualInterval: 60, // Интервал между начислением очков
  lossCost: 0,
}

export const defaultTeam = {
  name: 'Команда',
}

export default {
  teams: [
    {
      name: 'Команда 1',
    },
    {
      name: 'Команда 2',
    },
  ],
  minutes: 5,
  seconds: 0,
  immediateProfit: false, // Зачислятся ли очки сразу после захвата
  points: [cloneDeep(defaultPoint)],
} as IConfig
