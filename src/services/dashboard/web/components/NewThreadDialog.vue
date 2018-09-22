<template>
  <div>
    <v-btn @click='openDialog' icon light>
      <v-icon color='grey darken-2'>add</v-icon>
    </v-btn>
    <div class='text-xs-center'>
      <v-dialog
        v-model='dialog'
        width='400'>

        <v-card>
          <v-card-title
            class='headline grey lighten-2'
            primary-title>
            Connect with conversation
          </v-card-title>

      <v-card-text>
      <v-select :items='labeledInstances'
        v-model='selectedItem'
        label='Select service'
        item-value='value'/>

      <v-autocomplete v-if="dialog && selectedItem !== null && selectedItem.serviceModule.supportsThreadSearch"
        hide-no-data
        hide-details
        :disabled="selectedItem === null"
        no-filter
        label='Choose conversation'
        v-model='threadModel'
        :items='searchResults'
        :search-input.sync='searchItem'
        item-text='title'
        required return-object>
      <template
        slot="item"
        slot-scope="{ item, tile }"
      >
        <v-list-tile-avatar
        >
          <img :src="item.avatarUrl"/>
        </v-list-tile-avatar>
        <v-list-tile-content>
          <v-list-tile-title v-text="item.subtitle"></v-list-tile-title>
          <v-list-tile-sub-title v-text="item.title"></v-list-tile-sub-title>
        </v-list-tile-content>
        <v-list-tile-action>
          <v-icon>mdi-coin</v-icon>
        </v-list-tile-action>
      </template>
      </v-autocomplete>

      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
          <v-btn
            color='primary'
            flat
            @click='createNewThread()'>
          Create
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
  </div>
</template>

<script lang='ts'>
import Vue from 'vue'
import { Component, Prop, Watch } from 'nuxt-property-decorator'
import { State, namespace, Action } from 'vuex-class'
import axios from 'axios'
import * as serviceAction from '../store/modules/services/actions.types'
import * as actions from '../store/modules/connections/actions.types'
import { Route } from 'vue-router'
import ThreadConnection from '../../../../entity/ThreadConnection'

class VueWithRoute extends Vue {
  $route: Route
}

const connectionsModule = namespace('connections')
const servicesModule = namespace('services')

@Component({})
export default class NewThreadDialog extends Vue {
  @Prop() threadConnection
  searchItem = ''
  @connectionsModule.Getter('newConnectionId') newConnectionId
  @servicesModule.Getter('searchResults') searchResults

  @servicesModule.Getter('instances') instances
  @servicesModule.Action(serviceAction.LOAD_INSTANCES) loadInstances
  @servicesModule.Action(serviceAction.SEARCH_THREADS) searchItems
  @connectionsModule.Action(actions.CREATE_NEW_THREAD) createThread
  dialog = false
  threadModel: { id: string, title: string } = { id: '', title: '' }
  threadId: string = ''
  selectedItem: ThreadConnection | null = null

  async created() {
    this.loadInstances()
  }

  @Watch('searchItem')
  search(val: string) {
    if (
      this.selectedItem &&
      val &&
      val.toLowerCase() !== this.threadModel.title.toLowerCase()
    ) {
      this.searchItems({ id: this.selectedItem.id, query: val })
    }
  }

  get labeledInstances() {
    if (!this.instances) {
      return null
    }
    return this.instances.map(el => {
      return {
        text: `${el.serviceModule.displayName} (${el.instanceName})`,
        value: el,
      }
    })
  }

  async openDialog() {
    this.dialog = true
  }

  async closeDialog() {
    this.dialog = false
    this.threadId = ''
    this.selectedItem = {} as any
  }

  async createNewThread() {
    if (this.selectedItem) {
      this.createThread({
        serviceId: this.selectedItem.id,
        externalThreadId: this.threadModel.id,
        connId: this.threadConnection.id,
      })
      this.closeDialog()
    }
  }
}
</script>
