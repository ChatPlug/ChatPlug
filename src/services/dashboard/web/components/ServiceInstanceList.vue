<template>
  <div>
    <v-toolbar color="white" flat>
        <v-btn icon light>
          <v-icon color="grey darken-2">arrow_back</v-icon>
        </v-btn>
        <v-toolbar-title class="grey--text text--darken-4">Service instances</v-toolbar-title>
        <v-spacer></v-spacer>

        <v-btn icon light>
          <v-icon color="grey darken-2">add</v-icon>
        </v-btn>
  </v-toolbar>
    <v-list two-line avatar>
      <template v-for="(instance, index) in instances">

        <v-divider :key="index + '-divider'"></v-divider>
        <v-list-tile :key="instance.id + '-real-elem'" nuxt :to="`/instances/${instance.id}`">
          <v-list-tile-avatar v-bind:style="{ color: instance.brandColor || 'red' }">
            <span class="white--text headline">{{ instance.moduleName[0].toUpperCase() }}</span>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>
              <p>{{ instance.instanceName }}</p>
            </v-list-tile-title>
            <v-list-tile-sub-title>instance of
              <a>{{ instance.moduleName }}</a>
            </v-list-tile-sub-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-list-tile-action-text v-bind:style="{ color: instance.enabled ? 'green' : 'red' }">
              <p class="enabled">{{ instance.enabled ? 'enabled' : 'disabled' }}</p>
            </v-list-tile-action-text>

            <v-btn icon ripple>
              <v-icon color="grey lighten-1">info</v-icon>
            </v-btn>
          </v-list-tile-action>
        </v-list-tile>

      </template>

    </v-list>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'nuxt-property-decorator'
import { Action, namespace } from 'vuex-class'

@Component({})
export default class ServiceInstanceCard extends Vue {
  @Prop() instances
}
</script>
