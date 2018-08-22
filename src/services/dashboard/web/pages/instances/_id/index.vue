<style scoped>
</style>
<template>
  <div>
    <v-toolbar color="white" flat>
      <v-toolbar-title class="grey--text text--darken-4">Service {{id}}</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn flat color="red">
        Delete
      </v-btn>
    </v-toolbar>
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
      <v-tab ripple>
        Threads
      </v-tab>
      <v-tab ripple>
        Users
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
