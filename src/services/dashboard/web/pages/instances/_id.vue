<style scoped>
</style>
<template>
  <v-card>
    <v-toolbar flat>
      <v-toolbar-title class="grey--text text--darken-4">Service {{id}}</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn flat color="red">
        Delete
      </v-btn>
    </v-toolbar>
    <v-tabs slider-color="primary">
      <v-tab ripple nuxt :to="baseURL + '/status'">
        Status
      </v-tab>
      <v-tab ripple nuxt :to="baseURL + '/configuration'">
        Configuration
      </v-tab>
      <v-tab ripple nuxt :to="baseURL + '/logs'">
        Logs
      </v-tab>
      <v-tab ripple nuxt :to="baseURL + '/threads'">
        Threads
      </v-tab>
      <v-tab ripple nuxt :to="baseURL + '/users'">
        Users
      </v-tab>
    </v-tabs>
    <v-container>
      <nuxt-child />
    </v-container>
  </v-card>
</template>
<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'nuxt-property-decorator'
import { Action, namespace } from 'vuex-class'

@Component({})
export default class InstanceByID extends Vue {
  async asyncData({ params }) {
    return {
      ...params,
      baseURL: `/instances/${params.id}`,
    }
  }
}
</script>
