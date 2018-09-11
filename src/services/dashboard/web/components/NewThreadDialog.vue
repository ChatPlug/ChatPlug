<template>
  <div>
    <v-btn @click="openDialog" icon light>
      <v-icon color="grey darken-2">add</v-icon>
    </v-btn>
    <div class="text-xs-center">
      <v-dialog
        v-model="dialog"
        @keydown.enter="createNewThread()"
        width="400">

        <v-card>
          <v-card-title
            class="headline grey lighten-2"
            primary-title>
            Create new thread
          </v-card-title>

      <v-card-text>
        <v-text-field autofocus label="Thread id" v-model="threadId"
            @keyup.enter="createNewThread()"
            @keyup.esc="closeDialog()"/>

        <v-select :items="labeledInstances"
          v-model="selectedItems"
            label="Select"
            item-value="value"/>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
          <v-btn
            color="primary"
            flat
            @click="createNewThread()">
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
import { State, namespace, Action } from 'vuex-class'
import axios from 'axios'
import * as serviceAction from '../store/modules/services/actions.types'
import * as actions from '../store/modules/connections/actions.types'
import { Route } from 'vue-router'

class VueWithRoute extends Vue {
  $route: Route
}

const connectionsModule = namespace('connections')
const servicesModule = namespace('services')

@Component({})
export default class NewThreadDialog extends Vue {
  @connectionsModule.Getter('newConnectionId') newConnectionId
  @servicesModule.Getter('instances') instances
  @servicesModule.Action(serviceAction.LOAD_INSTANCES) loadInstances
  dialog = false
  threadId: string = ''
  selectedItems = []

  async created() {
    this.loadInstances()
  }

  get labeledInstances() {
    if (!this.instances) {
      return null
    }
    return this.instances.map((el) => { return { text: `${el.serviceModule.displayName} (${el.instanceName})`, value: el } })
  }

  async openDialog() {
    this.dialog = true
  }

  async closeDialog() {
    this.dialog = false
    this.threadId = ''
  }

  async createNewThread() {
  }
}
</script>
