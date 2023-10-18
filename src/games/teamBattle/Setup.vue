<script lang="ts">
import {defineComponent, PropType} from 'vue'
import config from './config'

export default defineComponent({
  name: "setup",

  props: {
    modelValue: {
      type: Object as PropType<config>,
      default: () => ({})
    }
  },

  methods: {
    changeModel(field, value) {
      this.$emit('update:model-value', {
        ...this.modelValue,
        [field]: value
      })
    }
  }
})
</script>

<template>
  <div>
    <v-text-field
      :model-value="modelValue.teams"
      label="Кол-во команд"
      @update:model-value="changeModel('teams', +$event || 0)"
    />
    <v-text-field
      :model-value="modelValue.teamHealth"
      label="Жизни команды"
      @update:model-value="changeModel('teamHealth', +$event) || 0"
    />
  </div>
</template>

<style scoped>

</style>
