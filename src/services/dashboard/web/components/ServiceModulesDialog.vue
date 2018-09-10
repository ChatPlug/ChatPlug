<template>
  <div>
    <v-btn @click="openDialog" icon light>
      <v-icon color="grey darken-2">add</v-icon>
    </v-btn>
    <div class="text-xs-center">
      <v-dialog
        v-model="dialog"
        scrollable
        width="500">

        <v-card>
          <v-card-title
            class="headline grey lighten-2"
            primary-title>
            Choose service to setup
          </v-card-title>

      <v-list three-line>
        <template v-for="(serviceModule) in modules">

          <v-list-tile :key="serviceModule.moduleName + '-real-elem'"  @click="createDraft(serviceModule.moduleName)">
            <v-list-tile-content>
              <v-list-tile-title>{{ serviceModule.displayName }} v{{ serviceModule.version }}
              </v-list-tile-title>
              <v-list-tile-sub-title>
                {{ serviceModule.description }}
              </v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-divider :key="serviceModule.moduleName + '-divider'"></v-divider>
        </template>
      </v-list>

      <v-card-actions>
        <v-spacer></v-spacer>
          <v-btn
            color="primary"
            flat
            @click="dialog = false">
          Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Watch } from 'nuxt-property-decorator'
import ServiceInstanceList from 'ServiceInstanceList.vue'
import { State, namespace, Action } from 'vuex-class'
import axios from 'axios'
import * as actions from '../store/modules/services/actions.types'
import { Route } from 'vue-router'

class VueWithRoute extends Vue {
  $route: Route
}

const servicesModule = namespace('services')

@Component({})
export default class ServiceModulesDialog extends Vue {
  @servicesModule.Getter('modules') modules
  @servicesModule.Getter('newInstanceId') newInstanceId
  @servicesModule.Action(actions.LOAD_MODULES) loadModules
  @servicesModule.Action(actions.CREATE_INSTANCE_DRAFT) createDraftAction
  dialog = false

  async openDialog() {
    this.dialog = true
    this.loadModules()
  }

  async createDraft(moduleName: string) {
    this.createDraftAction({ moduleName })
  }

  @Watch('newInstanceId')
  onNewInstanceId(val: number, oldVal: number) {
    this.dialog = false
    this.$router.push(`/instances/${val}/configuration`)
  }
}
</script>
