<template>
    <v-list two-list>
      <template>
        <div>&nbsp; There is no threads</div>
      </template>
    </v-list>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import { State, namespace, Action } from 'vuex-class'
import * as actions from '../../../store/modules/services/actions.types'

const servicesModule = namespace('connections')

@Component({})
export default class extends Vue {
  @Prop() currentConnection

  async created() {
  }

}
</script>
<style scoped>
</style>
