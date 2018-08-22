<template>
   <v-layout >
    <v-column>
      <v-subheader>
        Service instances
      </v-subheader>
       <v-list two-line>
        <template v-for="(instance, index) in instances">

            <v-divider
              :key="index"
            ></v-divider>
           <v-list-tile
              :key="instance.id"
            ><v-list-tile-content>
              <v-list-tile-title><p>{{ instance.instanceName }}</p></v-list-tile-title>
              <v-list-tile-sub-title>instance of <a>{{ instance.moduleName }}</a></v-list-tile-sub-title>
            </v-list-tile-content>
                <v-list-tile-action>
                <v-list-tile-action-text v-bind:style="{ color: instance.enabled ? 'green' : 'red' }"><p class="enabled">{{ instance.enabled ? 'enabled' : 'disabled' }}</p></v-list-tile-action-text>

              <v-btn icon ripple>
                <v-icon color="grey lighten-1">info</v-icon>
              </v-btn>
            </v-list-tile-action>
            </v-list-tile>

          </template>

        </v-list>
    </v-column>
  </v-layout>
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
