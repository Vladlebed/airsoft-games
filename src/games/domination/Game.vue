<template>
  <v-container v-if="gameState">
    <div v-if="(currentPoint === null) && !isAdmin && gameStatus !== 'end'">
      <p>Выберите точку</p>
      <v-divider class="mt-4 mb-4"/>
      <v-btn
        v-for="(point, pointIndex) in gameState.points"
        :key="pointIndex"
        color="primary"
        width="100%"
        class="mb-2"
        @click="currentPoint = pointIndex"
      >
        {{ point.name }}
      </v-btn>
      <v-btn color="red" width="100%" @click="isAdmin = true">
        Администратор
      </v-btn>
    </div>
    <template v-else>
      <template v-if="!isAdmin && gameStatus === 'inProcess'">
        <v-progress-linear :model-value="game.progress" :color="getProgressColor(game.progress)" height="30">
          Играть осталось: {{game.minutes}}:{{game.seconds >= 10 ? game.seconds : `0${game.seconds}`}}
        </v-progress-linear>
        <v-divider class="mt-4 mb-4"/>
        <h2 class="text-center mt-4 mb-4">{{gameState.points[currentPoint].name}}</h2>
        <p class="font-weight-bold mb-2">Информация:</p>
        <p>Владелец:
          <span class="font-weight-bold">
            <template v-if="gameState.points[currentPoint].owner !== -1">
              {{ gameState.teams[gameState.points[currentPoint].owner].name }}
            </template>
            <template v-else>
              нет
            </template>
          </span>
        </p>
        <p>Стоимость: <span class="font-weight-bold">{{ gameState.points[currentPoint].cost }}</span></p>
        <p>Время захвата: <span class="font-weight-bold">{{ gameState.points[currentPoint].captureTime }}</span></p>
        <p>Интервал награды: <span class="font-weight-bold">{{ gameState.points[currentPoint].accrualInterval }}</span></p>
        <p>Цена потери: <span class="font-weight-bold">{{ gameState.points[currentPoint].lossCost }}</span></p>
        <v-divider class="mt-4 mb-4" />
        <template
          v-for="(team, teamIndex) in gameState.teams"
          :key="teamIndex"
        >
          <v-btn
            v-if="gameState.points[currentPoint].owner !== teamIndex"
            width="100%"
            color="primary"
            class="pa-8 d-flex align-center mb-4"
            :loading="capture.team === teamIndex"
            @mousedown="captureMousedown(teamIndex)"
            @touchstart="captureMousedown(teamIndex)"
          >
            <template #loader>
              <v-progress-linear
                :model-value="capture.progressPercent"
                color="green"
                height="64"
              >
                {{ getCaptureTime() }}
              </v-progress-linear>
            </template>
            Захват: {{ team.name }}
          </v-btn>
        </template>
        <v-divider class="mt-4 mb-4" />
        <v-progress-linear
          v-if="computedCurrentPoint?.owner !== -1"
          :model-value="accrual.progress"
          color="purple"
          height="30"
        >
          <span class="text-white font-weight-bold">Бонус</span>
        </v-progress-linear>
      </template>
      <v-btn
        v-if="isAdmin && gameStatus === 'waiting'"
        color="orange"
        width="100%"
        class="pa-16 mb-4 d-flex align-content-center"
        :loading="isLoading"
        @click="startGame"
      >
        Начать игру
      </v-btn>
      <v-btn
        v-if="isAdmin && gameStatus === 'inProcess'"
        color="red"
        width="100%"
        class="pa-16 mb-4 d-flex align-content-center"
        :loading="isLoading"
        @click="endGame"
      >
        Завершить игру
      </v-btn>
    </template>
    <p class="mb-4 mt-4">
      <span class="font-weight-bold">Статус:</span>
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
    <v-divider class="mt-4 mb-4" />
    <v-row>
      <v-col v-for="(team, teamIndex) in gameState.teams" :key="teamIndex" cols="6">
        <div class="bg-primary pa-4">
          <p>
            {{ team.name }}
          </p>
          <div>
            <span>Очки: {{ team.score }}</span>
          </div>
        </div>
      </v-col>
    </v-row>
    <v-divider class="mt-4 mb-4" />
    <v-row>
      <v-col v-for="(point, pointIndex) in gameState.points" :key="pointIndex" cols="6">
        <div class="bg-green pa-4">
          <p>
            {{ point.name }}
          </p>
          <p>
            Владелец:
            <template v-if="point.owner !== -1">
              {{ gameState.teams[point.owner].name }}
            </template>
            <template v-else>
              нет
            </template>
          </p>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import {defineComponent, PropType} from 'vue'
import type config from "./config";
import {getDatabase, ref, onValue, update} from "firebase/database";
import gameChangeSignal from '@/assets/gameChange.mp3'
import {getProgressColor} from "@/helpers";
const audio = new Audio()
audio.src = gameChangeSignal

export default defineComponent({
  name: "Domination",

  props: {
    config: {
      type: Object as PropType<config>,
      default: () => ({})
    }
  },

  data() {
    return {
      currentPoint: null,
      isAdmin: false,
      gameState: null,
      isLoading: false,
      game: {
        left: '0:00',
        progress: null,
        minutes: null,
        seconds: null,
      },
      capture: {
        start: null,
        left: null,
        team: null,
        progressPercent: null,
        listener: null,
      },
      accrual: {
        start: null,
        end: null,
        progress: null,
      },
      ticker: null,
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

    computedCurrentPoint() {
      return this.gameState?.points[this.currentPoint]
    }
  },

  created() {
    const db = getDatabase();
    const { gameId } = this.$route.params
    const Ref = ref(db, `/games/${gameId}`);
    onValue(Ref, (snapshot) => {
      this.gameState = snapshot.val();
    });
  },

  mounted() {
    this.ticker = setInterval(this.tick, 100)
  },

  beforeUnmount() {
    clearInterval(this.ticker)
  },

  methods: {
    getProgressColor,

    getCaptureTime() {
      return this.capture.start ? Math.ceil((new Date().getTime() - this.capture.start.getTime()) / 1000) : 0
    },

    calculateGameProgress() {
      const startValue = this.gameState.endTime - this.gameState.started
      this.game.progress = (this.gameState.endTime - new Date().getTime()) / startValue * 100
      this.game.minutes = Math.floor((this.gameState.endTime - new Date().getTime()) / 1000 / 60)
      this.game.seconds = Math.floor((this.gameState.endTime - new Date().getTime()) / 1000 % 60)
    },

    calculatePointAccrual() {
      const startValue = this.accrual.end - this.accrual.start
      this.accrual.progress = 100 - (this.accrual.end - new Date().getTime()) / startValue * 100
    },

    updateGameState() {
      const db = getDatabase();
      const {gameId} = this.$route.params
      const Ref = ref(db, `/games/${gameId}`);
      update(Ref, this.gameState)
    },

    tick() {
      if (this.gameState?.started && !this.gameState?.end && this.game.progress !== null && this.game.progress <= 0) {
        this.endGame()
        clearInterval(this.ticker)
      }
      if (this.gameState?.started) {
        this.calculateGameProgress();
      }
      if (this.capture.start) {
        this.capture.left = this.getCaptureTime()
        this.capture.progressPercent = Math.ceil(this.getCaptureTime() / this.computedCurrentPoint.captureTime * 100)
        if (this.capture.progressPercent >= 100) {
          this.capture.start = null
          this.capture.left = null
          const point = this.gameState.points[this.currentPoint]
          if (point.owner !== -1) {
            this.gameState.teams[point.owner].score -= point.lossCost
          }
          point.owner = this.capture.team
          if (this.gameState.immediateProfit) {
            this.gameState.teams[point.owner].score += this.computedCurrentPoint.cost
          }
          window.removeEventListener('mouseup', this.captureMouseup)
          window.removeEventListener('touchend', this.captureMouseup)
          this.updateGameState()
        }
      }
      if (this.computedCurrentPoint?.owner !== -1 && this.computedCurrentPoint?.accrualInterval) {
        if (this.accrual.start === null) {
          this.accrual.start = new Date().getTime()
          this.accrual.end = new Date().getTime() + this.computedCurrentPoint.accrualInterval * 1000
        }
        this.calculatePointAccrual()
        if (this.accrual.progress >= 100) {
          this.accrual.start = null
          this.gameState.teams[this.computedCurrentPoint.owner].score += this.computedCurrentPoint.cost
          this.updateGameState()
        }
      }
    },

    captureMousedown(teamIndex: number) {
      this.capture.start = new Date()
      this.capture.team = teamIndex
      window.addEventListener('mouseup', this.captureMouseup)
      window.addEventListener('touchend', this.captureMouseup)
    },

    captureMouseup() {
      this.capture.start = null
      this.capture.left = null
      this.capture.team = null
      window.removeEventListener('mouseup', this.captureMouseup)
      window.removeEventListener('touchend', this.captureMouseup)
    },

    startGame() {
      const db = getDatabase();
      const {gameId} = this.$route.params
      const Ref = ref(db, `/games/${gameId}`);
      this.isLoading = true
      update(Ref, {
        ...this.gameState,
        started: new Date().getTime(),
        endTime: new Date().getTime() + (this.gameState.minutes * 60 * 1000) + (this.gameState.seconds * 1000)
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
    },
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
