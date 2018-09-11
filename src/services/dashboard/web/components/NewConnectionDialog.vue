<template>
  <div>
    <v-btn @click="openDialog" icon light>
      <v-icon color="grey darken-2">add</v-icon>
    </v-btn>
    <div class="text-xs-center">
      <v-dialog
        v-model="dialog"
        @keydown.enter="createNewConnection()"
        width="400">

        <v-card>
          <v-card-title
            class="headline grey lighten-2"
            primary-title>
            Create new thread group
          </v-card-title>

      <v-card-text>
        <v-text-field autofocus label="Group name" v-model="connectionName"
            @keyup.enter="createNewConnection()"
            @keyup.esc="closeDialog()"/>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
          <v-btn
            color="primary"
            flat
            @click="createNewConnection()">
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
import * as actions from '../store/modules/connections/actions.types'
import { Route } from 'vue-router'

class VueWithRoute extends Vue {
  $route: Route
}

const connectionsModule = namespace('connections')

@Component({})
export default class NewConnctionDialog extends Vue {
  @connectionsModule.Getter('newConnectionId') newConnectionId
  @connectionsModule.Action(actions.LOAD_CONNECTIONS) loadConnections
  @connectionsModule.Action(actions.CREATE_CONNECTION) createConnection
  dialog = false
  connectionName: string = ''

  async openDialog() {
    this.dialog = true
  }

  async closeDialog() {
    this.dialog = false
    this.connectionName = ''
  }

  async createNewConnection() {
    this.createConnection({ connectionName: this.connectionName })
  }

  @Watch('newConnectionId')
  onNewConnectionId(val: number, oldVal: number) {
    this.closeDialog()
    this.$router.push(`/connections/${val}/threads`)
  }
}
</script>
