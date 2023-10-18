<template>
  <div>
    <v-list>
      <v-list-item @click="createGame">
        Создать игру
      </v-list-item>
      <v-list-item v-if="false" @click="connectGame">
        Подключиться к игре
      </v-list-item>
    </v-list>
  </div>
</template>

<script lang="ts">
import dialogs from '@/store/dialogs.js'
import {defineAsyncComponent, markRaw} from "vue";
export default {
  methods: {
    createGame() {
      dialogs.modals.push({
        name: 'createGame',
        title: 'Создать игру',
        component: markRaw(defineAsyncComponent(() => import('@/components/dialog/CreateGame.vue')))
      })
    },

    connectGame() {
      dialogs.modals.push({
        name: 'connectGame',
        title: 'Подключиться к игре',
        component: markRaw(defineAsyncComponent(() => import('@/components/dialog/ConnectGame.vue')))
      })
    },
  }
}
</script>
