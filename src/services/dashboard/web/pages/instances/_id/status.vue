
<template>
    <v-container grid-list-md>
        <v-layout wrap>
            <v-flex xs12 sm6>
                <v-card color="primary darken-2" dark raised>
                    <v-card-title primary-title>
                        <div>
                            <h3 class="headline mb-0">{{currentInstance.serviceModule.displayName}}</h3>
                            <div>{{currentInstance.serviceModule.description}}</div>
                        </div>
                    </v-card-title>
                    <v-card-actions>
                        <v-spacer />
                        <v-btn flat disabled>Homepage</v-btn>
                    </v-card-actions>
                </v-card>
            </v-flex>
            <v-flex xs12 sm6>
                <v-card raised>
                    <v-card-title primary-title>
                        <div>
                            <h3 class="headline mb-0" v-if="currentInstance.enabled">Service enabled</h3>
                            <h3 class="headline mb-0" v-else>Service disabled</h3>
                        </div>
                    </v-card-title>
                    <v-card-actions>
                        <v-spacer />
                        <v-btn flat v-if="currentInstance.enabled">Disable</v-btn>
                        <v-btn flat v-else>Enable</v-btn>
                    </v-card-actions>
                </v-card>
            </v-flex>
        </v-layout>
        <!-- <v-alert :value="true" type="info" color="primary" outline>
            <div class="caption">Service description</div>
            {{currentInstance.serviceModule.description}}
        </v-alert> -->
        <!-- <v-container>
            <v-card>
                <v-card-text>
                    This service is ENABLED
                </v-card-text>
            </v-card>
        </v-container> -->
    </v-container>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import { State, namespace, Action } from 'vuex-class'

@Component({})
export default class extends Vue {
  @Prop() currentInstance
}
</script>
<style scoped>
</style>
