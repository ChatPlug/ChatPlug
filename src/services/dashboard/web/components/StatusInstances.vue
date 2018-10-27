<template>
      <v-card>
        <v-toolbar color="green" dark>

          <v-toolbar-title>Service status</v-toolbar-title>

          <v-spacer></v-spacer>

          <v-btn flat  nuxt to="instances/" center>
          Manage instances
          </v-btn>
        </v-toolbar>
                  <v-subheader>Services</v-subheader>
          <v-list
            subheader
            two-line
          >
           <template v-for="(instance, index) in instances">
             <v-divider :key="index + '-divider'"></v-divider>
            <v-list-tile
            color="success"
            :key="index + '-real-elem'"
            nuxt :to="`/instances/${instance.id}/status`"
            >
              <v-list-tile-content>
                <v-list-tile-title v-text="instance.moduleName.charAt(0).toUpperCase() + instance.moduleName.slice(1)"></v-list-tile-title>
                <v-list-tile-sub-title v-text="'Status: ' + instance.status"></v-list-tile-sub-title>
              </v-list-tile-content>
          </v-list-tile>
           </template>
        </v-list>
      </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'nuxt-property-decorator'
import ServiceModulesDialog from './ServiceModulesDialog.vue'
import { Action, namespace } from 'vuex-class'
import { Route } from 'vue-router'
import * as actions from '../store/modules/services/actions.types'

const servicesModule = namespace('services')

@Component({
})
export default class StatusInstances extends Vue {
  @servicesModule.Getter('instances') instances
  @servicesModule.Action(actions.LOAD_INSTANCES) loadInstances

  async created() {
    this.loadInstances()
  }
}
</script>
