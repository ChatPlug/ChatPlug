<template>
    <v-list two-list>
      <template v-if="1 === 1">
        <v-list-tile>
          <v-list-tile-content>
            <v-list-tile-title>
                ddd
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </template>
      <template v-else>
        <div>&nbsp; There is no Logs</div>
      </template>
    </v-list>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { State, namespace, Action } from 'vuex-class'

@Component({})
export default class extends Vue {}
</script>
<style scoped>
</style>
