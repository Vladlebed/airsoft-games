<template>
  <div>
    <v-text-field
      :model-value="modelValue.teams"
      label="Кол-во команд"
      @update:model-value="changeModel('teams', +$event || 0)"
    />
    <v-slider
      :model-value="modelValue.minutes"
      thumb-label
      step="1"
      label="Минуты"
      min="0"
      max="180"
      color="primary"
      @update:model-value="changeModel('minutes', $event)"
    />
    <v-slider
      :model-value="modelValue.seconds"
      thumb-label
      step="1"
      label="Секунды"
      min="0"
      max="60"
      color="primary"
      @update:model-value="changeModel('seconds', $event)"
    />
    <v-slider
      :model-value="modelValue.additionalSeconds"
      thumb-label
      step="1"
      label="Доп. секунды"
      min="0"
      max="60"
      color="primary"
      @update:model-value="changeModel('additionalSeconds', $event)"
    />
  </div>
</template>

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
    },
  }
})
</script>

<style scoped>

</style>
