import teamBattle from "./teamBattle";
import { Component } from "vue";
import kingOfHill from "./kingOfHill";

export interface IGame {
  name: string
  config: IConfig
  setup: Component
  game: Component
  state: (config: IConfig) => any
}

export interface IConfig {
  [key: string]: IConfigField | any
}

export interface IConfigField {
  min?: number
  max?: number
  value: any
}

const games: { [key: string]: IGame } = {
  teamBattle,
  kingOfHill
}
export default games
