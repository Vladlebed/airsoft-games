<template>
  <v-card-text>
    <v-autocomplete
      :model-value="selectedGame"
      label="Тип"
      :items="computedGames"
      item-title="name"
      return-object
      @update:model-value="selectGame"
    />
    <template v-if="selectedGame">
      <v-divider class="mb-4"/>
      <component v-model="selectedGame.config" :is="selectedGame.setup" />
    </template>
  </v-card-text>
  <v-card-actions v-if="selectedGame">
    <v-btn :loading="isLoading" width="100%" color="primary" @click="createGame">
      Создать игру
    </v-btn>
  </v-card-actions>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import games from "@/games";
import dialogs from "@/store/dialogs";
import { cloneDeep } from 'lodash-es'
import { push, getDatabase, ref } from 'firebase/database'

export default defineComponent({
  name: "CreateGame",

  computed: {
    computedGames() {
      return Object.entries(games).map(([gameType, game]) => ({
        ...game,
        gameType
      }))
    }
  },

  data() {
    return {
      selectedGame: null,
      isLoading: false
    }
  },

  methods: {
    selectGame(game) {
      this.selectedGame = {
        ...game,
        config: cloneDeep(game.config)
      }
    },

    createGame() {
      const db = getDatabase()
      this.isLoading = true
      console.log('this.selectedGame.state(this.selectedGame.config)', this.selectedGame.state(this.selectedGame.config))
      push(ref(db, `/games`), this.selectedGame.state(this.selectedGame.config))
        .then((r) => {
          this.$router.push({
            name: 'Game',
            params: {
              gameType: this.selectedGame.gameType,
              gameId: r.key
            }
          })
          dialogs.modals.remove('createGame')
        })
        .finally(() => {
          this.isLoading = false
        })
    }
  }
})
</script>

<style scoped>

</style>
