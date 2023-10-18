<template>
  <v-card-text>
    <v-text-field v-model="id" label="Идентификатор" />
  </v-card-text>
  <v-card-actions>
    <v-btn :disabled="!id" color="primary" @click="moveToGame">
      Плдключиться
    </v-btn>
  </v-card-actions>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  data() {
    return {
      id: ''
    }
  },

  methods: {
    moveToGame() {
      this.$router.push()
    }
  }
})
</script>

<style scoped>

</style>
