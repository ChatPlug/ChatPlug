<template>
  <div>
    <v-btn @click="openDialog" icon light>
      <v-icon color="grey darken-2">add</v-icon>
    </v-btn>
    <div class="text-xs-center">
      <v-dialog
        v-model="dialog"
        width="400">

        <v-card>
          <v-card-title
            class="headline grey lighten-2"
            primary-title>
            Create new thread group
          </v-card-title>

      <v-card-text>
        <v-text-field label="Group name" v-model="connectionName" />
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
          <v-btn
            color="primary"
            flat
            @click="dialog = false">
          Create
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

const connectionsModule = namespace('connections')

@Component({})
export default class NewConnctionDialog extends Vue {
  /*@servicesModule.Getter('newInstanceId') newInstanceId
  @servicesModule.Action(actions.LOAD_MODULES) loadModules
  @servicesModule.Action(actions.CREATE_INSTANCE_DRAFT) createDraftAction*/
  dialog = false
  connectionName: string

  async openDialog() {
    this.dialog = true
    // this.loadModules()
  }

  /*async createDraft(moduleName: string) {
    this.createDraftAction({ moduleName })
  }

  @Watch('newInstanceId')
  onNewInstanceId(val: number, oldVal: number) {
    this.dialog = false
    this.$router.push(`/instances/${val}/configuration`)
  }*/
}
</script>
