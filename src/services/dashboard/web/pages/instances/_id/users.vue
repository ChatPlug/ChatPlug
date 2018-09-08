
<template>
      <v-list>
           <v-list-tile
            v-for="user in currentInstance.users"
            :key="user.username"
            avatar
          >
          <v-list-tile-content>
              <v-list-tile-title v-text="user.username"></v-list-tile-title>
            </v-list-tile-content>

            <v-list-tile-avatar>
              <img :src="user.avatarUrl">
            </v-list-tile-avatar>
           </v-list-tile>
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
      this.loadUsers()
  }
}
</script>
<style scoped>
</style>
