<template>
  <v-container v-if="gameState">
    <div v-if="(currentTeam === null) && !isAdmin && gameStatus !== 'end'">
      <p>Из какой вы команды?</p>
      <v-divider class="mt-4 mb-4"/>
      <v-btn
        v-for="(team, teamIndex) in gameState.teams"
        :key="teamIndex"
        color="primary"
        width="100%"
        class="mb-2"
        @click="currentTeam = teamIndex"
      >
        {{ teamIndex + 1 }}
      </v-btn>
      <v-btn color="red" width="100%" @click="isAdmin = true">
        Администратор
      </v-btn>
    </div>
    <template v-else>
      <template v-if="!isAdmin && gameStatus === 'inProcess'">
        <v-btn
          width="100%"
          color="red"
          class="pa-16 d-flex align-content-center"
          :loading="isLoading"
          @click="decrementTeamHealth"
        >
          УБИТ
        </v-btn>
        <v-divider class="mt-4 mb-4" />
      </template>
      <v-btn
        v-if="isAdmin && gameStatus === 'waiting'"
        color="orange"
        width="100%"
        class="mb-4"
        :loading="isLoading"
        @click="startGame"
      >
        Начать игру
      </v-btn>
      <v-btn
        v-if="isAdmin && gameStatus === 'inProcess'"
        color="red"
        width="100%"
        class="mb-4"
        :loading="isLoading"
        @click="endGame"
      >
        Завершить игру
      </v-btn>
    </template>
    <p class="mb-4 mt-4">
      Статус:
      <template v-if="gameStatus === 'end'">
        Игра завершена
      </template>
      <template v-else-if="gameStatus === 'waiting'">
        Ожидание начала
      </template>
      <template v-else>
        Игра идёт
      </template>
    </p>
    <p class="mb-4 font-weight-bold">Статистика: </p>
    <v-divider class="mt-4 mb-4" />
    <v-row>
      <v-col v-for="(team, teamIndex) in gameState.teams" :key="teamIndex" cols="6">
        <div class="bg-primary pa-4">
          <p>
            Team: {{ teamIndex + 1 }}
            <template v-if="teamIndex === currentTeam">
              (You)
            </template>
          </p>
          <div>
            <span>Жизни: {{ team.teamHealth }}</span>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import {defineComponent, PropType} from 'vue'
import config from "@/games/teamBattle/config";
import {getDatabase, ref, onValue, update} from "firebase/database";
import gameChangeSignal from '@/assets/gameChange.mp3'
const audio = new Audio()
audio.src = gameChangeSignal

export default defineComponent({
  name: "TeamBattle",

  props: {
    config: {
      type: Object as PropType<config>,
      default: () => ({})
    }
  },

  data() {
    return {
      currentTeam: null,
      isAdmin: false,
      gameState: null,
      isLoading: false,
    }
  },

  computed: {
    gameStatus() {
      if (!this.gameState) return ''
      switch (true) {
        case !!this.gameState?.end: return 'end'
        case !this.gameState?.started: return 'waiting'
        default: return 'inProcess'
      }
    }
  },

  created() {
    const db = getDatabase();
    const { gameId } = this.$route.params
    const Ref = ref(db, `/games/${gameId}`);
    onValue(Ref, (snapshot) => {
      this.gameState = snapshot.val();
      console.log(this.gameState)
    });
  },

  methods: {
    decrementTeamHealth() {
      const db = getDatabase();
      const { gameId } = this.$route.params
      const Ref = ref(db, `/games/${gameId}/teams/${this.currentTeam}`);
      const newHealth = this.gameState.teams[this.currentTeam].teamHealth - 1
      this.isLoading = true
      update(Ref, { teamHealth: newHealth })
        .finally(() => {
          this.isLoading = false
        })
      if (newHealth <= 0) {
        this.endGame()
      }
    },

    startGame() {
      const db = getDatabase();
      const {gameId} = this.$route.params
      const Ref = ref(db, `/games/${gameId}`);
      this.isLoading = true
      update(Ref, {
        ...this.gameState,
        started: new Date().getTime()
      })
        .finally(() => {
          this.isLoading = false
        })
    },

    endGame() {
      const db = getDatabase();
      const { gameId } = this.$route.params
      const Ref = ref(db, `/games/${gameId}`);
      this.isLoading = true
      update(Ref, {
        ...this.gameState,
        end: new Date().getTime()
      })
        .finally(() => {
          this.isLoading = false
        })
    }
  },

  watch: {
    gameStatus(newVal, oldVal) {
      if (oldVal) {
        audio.play()
      }
    }
  }
})
</script>

<style scoped>

</style>
