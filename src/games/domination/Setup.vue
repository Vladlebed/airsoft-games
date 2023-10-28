<template>
  <div>
    <v-text-field
      v-model.number="modelValueSnapshot.minutes"
      label="Минуты"
    />
    <v-text-field
      v-model.number="modelValueSnapshot.seconds"
      label="Секунды"
    />
    <v-checkbox
      v-model.number="modelValueSnapshot.immediateProfit"
      label="Мгновенный бонус захвата"
    />
    <v-divider class="mt-4 mb-4" />
    <div>
      <div
        v-for="(team, teamIndex) in modelValueSnapshot.teams"
        :key="teamIndex"
        class="d-flex"
      >
        <div class="flex-grow-1">
          <v-text-field
            v-model="team.name"
            label="Название команды"
          />
        </div>
        <v-btn color="primary" class="ml-4 mt-2" size="small" icon @click="removeTeam(teamIndex)">
          <v-icon>
            mdi-close
          </v-icon>
        </v-btn>
      </div>
      <v-btn color="primary" width="100%" @click="addTeam">Добавить команду</v-btn>
    </div>
    <v-divider class="mt-4 mb-4" />
    <div>
      <div
        v-for="(point, pointIndex) in modelValueSnapshot.points"
        :key="pointIndex"
        class="d-flex"
      >
        <div class="flex-grow-1">
          <v-text-field
            v-model="point.name"
            label="Название точки"
          />
          <v-text-field
            v-model.number="point.pointCost"
            label="Стоимость точки"
          />
          <v-text-field
            v-model.number="point.captureTime"
            label="Время захвата (сек)"
          />
          <v-text-field
            v-model.number="point.accrualInterval"
            label="Интервал бонуса завхвата (сек)"
          />
        </div>
        <v-btn color="primary" class="ml-4 mt-2" size="small" icon @click="removePoint(pointIndex)">
          <v-icon>
            mdi-close
          </v-icon>
        </v-btn>
      </div>
      <v-btn color="primary" width="100%" @click="addPoint">Добавить точку</v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from 'vue'
import config, {defaultPoint, defaultTeam} from './config'
import {cloneDeep} from "lodash-es";

export default defineComponent({
  name: "setup",

  props: {
    modelValue: {
      type: Object as PropType<config>,
      default: () => ({})
    }
  },

  data() {
    return {
      modelValueSnapshot: null,
    }
  },

  created() {
    this.modelValueSnapshot = cloneDeep(this.modelValue)
  },

  methods: {
    changeModel(field, value) {
      this.$emit('update:model-value', {
        ...this.modelValue,
        [field]: value
      })
    },

    addTeam() {
      this.modelValueSnapshot.teams.push(cloneDeep(defaultTeam))
    },

    removeTeam(index) {
      this.modelValueSnapshot.teams.splice(index, 1)
    },

    addPoint() {
      this.modelValueSnapshot.points.push(cloneDeep(defaultPoint))
    },

    removePoint(index) {
      this.modelValueSnapshot.points.splice(index, 1)
    },
  },

  watch: {
    modelValueSnapshot: {
      deep: true,
      handler(nVal, oVal) {
        if (oVal) {
          this.$emit('update:model-value', nVal)
        }
      }
    }
  }
})
</script>

<style scoped>

</style>
