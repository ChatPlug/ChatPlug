<style scoped>
</style>
<template>
  <div>
    <h1>Service {{id}}</h1>
    <v-tabs slider-color="primary">
      <v-tab ripple>
        Status
      </v-tab>
      <v-tab ripple>
        Configuration
      </v-tab>
      <v-tab ripple>
        Logs
      </v-tab>
    </v-tabs>
  </div>
</template>
<script lang=ts>
import Vue from 'vue'
import { Component, Prop } from 'nuxt-property-decorator'
import { Action, namespace } from 'vuex-class'

@Component({})
export default class ServiceInstanceCard extends Vue {
  async asyncData({ params }) {
    return {
      ...params,
    }
  }
}
</script>
