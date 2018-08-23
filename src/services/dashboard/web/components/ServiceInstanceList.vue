<template>
  <v-card>
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
        <v-list-tile :key="instance.id + '-real-elem'" nuxt :to="`/instances/${instance.id}/status`">
          <div class="v-list__tile__avatar">
            <v-avatar v-bind:style="{ backgroundColor: instance.serviceModule.brandColor}">
              <span class="white--text headline">{{ instance.moduleName[0].toUpperCase() }}</span>
            </v-avatar>
          </div>
          <v-list-tile-content>
            <v-list-tile-title>{{ instance.serviceModule.displayName }}
            </v-list-tile-title>
            <v-list-tile-sub-title>
              ({{ instance.instanceName }})
            </v-list-tile-sub-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-list-tile-action-text v-bind:style="{ color: instance.enabled ? 'green' : 'red' }">
              <p class="enabled">{{ instance.enabled ? 'enabled' : 'disabled' }}</p>
            </v-list-tile-action-text>
          </v-list-tile-action>
        </v-list-tile>

      </template>

    </v-list>
  </v-card>
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
