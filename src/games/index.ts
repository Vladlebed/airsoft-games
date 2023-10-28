import teamBattle from "./teamBattle";
import domination from "./domination";
import { Component } from "vue";

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
  domination
}
export default games
