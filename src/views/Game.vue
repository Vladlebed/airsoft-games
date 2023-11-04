<template>
  <div>
    <v-container>
      <h2 class="mb-2 mt-4 text-center">{{ gameStructure.name }}</h2>
    </v-container>
    <component :is="gameStructure.game" :config="gameStructure.config"/>
    <v-container>
      <v-btn width="100%" color="primary" @click="viewQr = !viewQr">
        Toggle QR
      </v-btn>
      <div v-if="viewQr" class="d-flex justify-center">
        <qrcode-vue  :value="address" class="mt-4" :size="300" />
      </div>
    </v-container>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import { camelCase } from 'lodash-es'
import games from '@/games'
import QrcodeVue from 'qrcode.vue'

export default defineComponent({
  name: "Game",
  components: {
    QrcodeVue
  },

  data() {
    return {
      viewQr: false,
    }
  },

  computed: {
    gameStructure() {
      const gameType = camelCase(this.$route.params.gameType)
      return games[gameType]
    },

    address() {
      return document.location.href
    }
  }
})
</script>

<style scoped>

</style>
