<template>
  <v-layout row>
    <v-flex xs12 sm6 offset-sm3 mr-3 ml-0>
      <v-card>
        <v-toolbar color="green" dark>

          <v-toolbar-title>Status</v-toolbar-title>

          <v-spacer></v-spacer>

          <v-btn nuxt to="instances/" center color="green lighten-1">
          See instances
          </v-btn>
        </v-toolbar>

        <v-list two-line subheader>
          <v-subheader>General</v-subheader>

          <v-list-tile color="green">
            <v-list-tile-content>
              <v-list-tile-title>API Status</v-list-tile-title>
              <v-list-tile-sub-title>Online</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile color="green">
            <v-list-tile-content>
              <v-list-tile-title>DashBoard Status</v-list-tile-title>
              <v-list-tile-sub-title>Online</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>

        <v-divider></v-divider>

        <v-list
          subheader
          two-line
        >
          <v-subheader>Services  d</v-subheader>

          <v-list-tile color="error">
            <v-list-tile-content>
              <v-list-tile-title>Discord</v-list-tile-title>
              <v-list-tile-sub-title>Error</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile color="secondary">
            <v-list-tile-content>
              <v-list-tile-title>Telegram</v-list-tile-title>
              <v-list-tile-sub-title>Offline</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile color="secondary">
            <v-list-tile-content >
              <v-list-tile-title>Facebook</v-list-tile-title>
              <v-list-tile-sub-title>Not Configured</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-card>
    </v-flex>
    <v-flex xs12 sm6 ml-3>
      <v-toolbar color="indigo" dark>

        <v-toolbar-title>Summary</v-toolbar-title>

      </v-toolbar>

      <v-card>
        <v-container
          fluid
          g-rid-list-md
        >
          <v-layout row wrap>
          <v-flex xs3>
            <v-card color="indigo" class="white--text">
             <v-list three-line>
              <v-list-tile color="secondary">
                  <v-list-tile-content >
                    <v-list-tile-title>Messages Today</v-list-tile-title>
                    <v-list-tile-sub-title class="px-0 title" ><v-icon color="blue darken-2">chat</v-icon> 14 </v-list-tile-sub-title>
                  </v-list-tile-content>
               </v-list-tile>

                <v-list-tile color="secondary">
                  <v-list-tile-content >
                    <v-list-tile-title>Messages Weelky</v-list-tile-title>
                    <v-list-tile-sub-title class="px-0 title" ><v-icon color="blue darken-2">chat</v-icon> 47 </v-list-tile-sub-title>
                  </v-list-tile-content>
               </v-list-tile>

             </v-list>
            </v-card>
          </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { State, namespace, Action } from 'vuex-class'

@Component({})
export default class extends Vue {
  created() {
    // this.$router.push('/instances') // temporary redirect until we make a proper front page
  }
}
</script>
<style scoped>
</style>
