<template>
  <v-container v-if="gameState">
    <p v-if="currentTeam === null">Игра ещё не началась</p>
    <p v-else>Царь: {{ currentTeam + 1 }}</p>
    <v-row>
      <v-col v-for="(team, teamIndex) in gameState.teams" :key="teamIndex" cols="6">
        <div class="bg-primary pa-4">
          <p>
            Team: {{ teamIndex + 1 }}
          </p>
          <div>
            <p>Минуты: {{ team.minutes }}</p>
            <p>Секунды: {{ team.seconds }}</p>
          </div>
          <v-btn
            v-if="currentTeam !== teamIndex"
            color="red"
            width="100%"
            class="pa-16 d-flex align-content-center"
            @click="changeKing(teamIndex)"
          >
            Царь
          </v-btn>
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
  name: "kingOfHill",

  props: {
    config: {
      type: Object as PropType<config>,
      default: () => ({})
    }
  },

  data() {
    return {
      interval: null,
      isAdmin: false,
      gameState: null,
      isLoading: false,
      currentTeam: null,
      startTime: null,
      currentTime: null,
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
    },

    currentTeamObject() {
      if (!this.currentTeam) return null
      return this.gameState?.teams[this.currentTeam]
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

  beforeUnmount() {
    clearInterval(this.interval)
  },

  methods: {
    changeKing(index) {
      if (this.currentTeam === null) {
        this.interval = setInterval(this.tick, 500)
        this.startGame()
      }
      this.currentTeam = index
    },

    tick() {
      const currentTime = new Date().getTime()
      const secondsPassed = (currentTime - this.currentTime) / 1000
      this.currentTime = currentTime
      this.gameState.teams.forEach((team, teamIndex) => {
        if (teamIndex === this.currentTeam) return
        const sec = team.minutes * 60 + team.seconds - secondsPassed
        console.log(Math.floor(sec / 60), Math.floor(sec / 60) % 60)
        // team.minutes = Math.floor(sec / 60)
        // team.seconds = team.minutes % 60
      })
    },

    startGame() {
      // const db = getDatabase();
      // const {gameId} = this.$route.params
      // const Ref = ref(db, `/games/${gameId}`);
      // this.isLoading = true
      this.startTime = new Date().getTime()
      this.currentTime = this.startTime
      // update(Ref, {
      //   ...this.gameState,
      //   started: this.startTime
      // })
      //   .finally(() => {
      //     this.isLoading = false
      //   })
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
