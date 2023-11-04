<template>
  <v-app>
    <default-bar />

    <default-view />
  </v-app>
</template>

<script lang="ts">
import DefaultBar from './AppBar.vue'
import DefaultView from './View.vue'

export default {
  name: 'LayoutDefault',

  components: {
    DefaultBar,
    DefaultView
  },
}
</script>
