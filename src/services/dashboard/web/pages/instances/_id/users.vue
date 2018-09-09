<template>
  <v-list two-line avatar>
      <template v-if="users !== null && users.length > 0" v-for="(user, index) in users">

        <v-divider :key="index+ '-divider'"></v-divider>
        <v-list-tile :key="user.id + '-real-elem'">
          <v-list-tile-content>
            <v-list-tile-title  v-text="user.username">
            </v-list-tile-title>
            <v-list-tile-sub-title  v-text="'#' + user.externalServiceId">
            </v-list-tile-sub-title>
          </v-list-tile-content>
           <v-list-tile-avatar>
              <img :src="user.avatarUrl">
            </v-list-tile-avatar>
        </v-list-tile>
      </template>
      <template v-if="users == null || users.length === 0">
        <div>None</div>
      </template>
    </v-list>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import { State, namespace, Action } from 'vuex-class'
import * as actions from '../../../store/modules/services/actions.types'

const servicesModule = namespace('services')

@Component({})
export default class extends Vue {
  @Prop() currentInstance
  @servicesModule.Action(actions.LOAD_USERS) loadUsers

  async created() {
    this.loadUsers({ id: this.currentInstance.id })
  }

  get users() {
    if (!this.currentInstance) {
      return null
    }

    return this.currentInstance.users || null
  }
}
</script>
<style scoped>
</style>
