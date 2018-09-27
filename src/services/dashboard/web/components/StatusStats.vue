<template>
  <v-layout row wrap>
    <v-flex md3 pa-1>
      <v-card color="indigo accent-2" class="white--text">
        <v-card-title primary-title>
          <div>
            <div class="headline">2221</div>
            <span class="white--text">Messages sent today</span>
          </div>
        </v-card-title>
        </v-card>
    </v-flex>
    <v-flex md3 pa-1>
      <v-card color="indigo accent-3" class="white--text">
        <v-card-title primary-title>
          <div>
            <div class="headline">4021</div>
            <span class="white--text">Messages sent this week</span>
          </div>
        </v-card-title>
        </v-card>
    </v-flex>
    <v-flex md3 pa-1>
      <v-card color="light-blue darken-1" class="white--text">
        <v-card-title primary-title>
          <div>
            <div class="headline">516</div>
            <span class="white--text">Friends connected</span>
          </div>
        </v-card-title>
        </v-card>
    </v-flex>
    <v-flex md3 pa-1>
      <v-card color="indigo accent-4" class="white--text">
        <v-card-title primary-title>
          <div>
            <div class="headline">21</div>
            <span class="white--text">Connected conversations</span>
          </div>
        </v-card-title>
        </v-card>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'nuxt-property-decorator'
import { Action, namespace } from 'vuex-class'
import { Route } from 'vue-router'
import * as actions from '../store/modules/connections/actions.types'

const connectionsModule = namespace('connections')

@Component({
})
export default class StatusStats extends Vue {

}
</script>
