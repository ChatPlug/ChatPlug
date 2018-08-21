<template>
  <section>
    <div class="flex flex-wrap ph2 justify-between bg-white-80">
      <div v-for="instance in instances" :key="instance.id">
        <ServiceInstanceCard :instance="instance"/>
      </div>
</div>
</section>
</template>

<script lang="ts">
import ServiceInstanceCard from '~/components/ServiceInstanceCard.vue'
import {
  Component,
  Vue,
} from 'nuxt-property-decorator'
import { State, namespace, Action } from 'vuex-class'
import axios from 'axios'
import * as actions from '../store/modules/services/actions.types'

const servicesModule = namespace('services')

@Component({
  components: {
    ServiceInstanceCard: ServiceInstanceCard as any,
  },
})
export default class extends Vue {
  @servicesModule.Getter('instances') instances
  @servicesModule.Action(actions.LOAD_INSTANCES) loadInstances
  async created() {
    await this.loadInstances()
  }
}
</script>
<style scoped>
</style>
