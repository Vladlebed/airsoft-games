<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: "Profile"
})
</script>

<template>
  <v-container class="pa-6">
    <v-row>
      <v-col cols="12" lg="8">
        <v-card class="pa-4">
          <v-table>
            <tbody>
              <tr>
                <td width="150">Позывной</td>
                <td>Утка</td>
              </tr>
              <tr>
                <td width="100">Ранг</td>
                <td>Новичек</td>
              </tr>
              <tr>
                <td width="100">Команда</td>
                <td>Нет</td>
              </tr>
              <tr>
                <td width="100">Контакты</td>
                <td>Нет</td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-col>
      <v-col cols="12" lg="4">
        <v-card class="pa-4">
          test
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>

</style>
