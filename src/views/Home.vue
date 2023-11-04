<template>
  <v-container class="pa-6">
    <v-list class="pa-4 text-center ma-auto" max-width="600">
      <v-list-item @click="createGame">
        Создать игру
      </v-list-item>
      <v-list-item v-if="false" @click="connectGame">
        Подключиться к игре
      </v-list-item>
      <v-list-item v-if="false" @click="auth">
        Вход / Регистрация
      </v-list-item>
      <v-list-item v-if="false" :to="{ name: 'Profile', params: { id: 123 } }">
        Профиль
      </v-list-item>
    </v-list>
  </v-container>
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

    auth() {
      dialogs.modals.push({
        name: 'auth',
        title: 'Вход / Регистрация',
        component: markRaw(defineAsyncComponent(() => import('@/components/dialog/Auth.vue')))
      })
    },
  }
}
</script>
