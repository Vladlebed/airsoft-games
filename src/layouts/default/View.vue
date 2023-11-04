<template>
  <v-main>
    <v-breadcrumbs v-if="false" color="primary" :items="breadcrumbs" divider=">" />

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
        <v-card-title v-if="dialog.title" class="d-flex align-center justify-space-between">
          {{ dialog.title }}
          <v-btn flat class="ml-4 mt-2" icon @click="closeDialog(dialog.name)">
            <v-icon>
              mdi-close
            </v-icon>
          </v-btn>
        </v-card-title>
        <component
          :is="dialog.component"
          v-bind="dialog.props"
        />
      </v-card>
    </v-dialog>
  </v-main>
</template>

<script lang="ts">
import dialogs from '@/store/dialogs.js'
import {computed} from "vue";

const modals = computed(() => {
  return dialogs.modals.dialogs
})

const closeDialog = (dialogName) => {
  dialogs.modals.remove(dialogName)
}

export default {
  setup() {
    return {
      modals,
      closeDialog,
    }
  },

  computed: {
    breadcrumbs() {
      return this.$route.matched?.map(({ name }) => ({
        title: name,
        disabled: false,
        to: { name, params: this.$route.params }
      })) || []
    },
  }
}
</script>
