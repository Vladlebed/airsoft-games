<template>
  <v-main>
    <router-view />

    <v-dialog
      v-for="dialog in modals"
      :key="dialog.name"
      :model-value="true"
      max-width="900"
      content-class="overflow-hidden"
      @click:outside="closeDialog(dialog.name)"
      @keydown.esc="closeDialog(dialog.name)"
    >
      <v-card>
        <v-card-title v-if="dialog.title">
          {{ dialog.title }}
        </v-card-title>
        <component
          :is="dialog.component"
          v-bind="dialog.props"
        />
      </v-card>
    </v-dialog>
  </v-main>
</template>

<script lang="ts" setup>
import dialogs from '@/store/dialogs.js'
import {computed} from "vue";

const modals = computed(() => {
  return dialogs.modals.dialogs
})

const closeDialog = (dialogName) => {
  dialogs.modals.remove(dialogName)
}
</script>
