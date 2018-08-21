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
import axios from 'axios'
@Component({
  components: {
  },
})
export default class extends Vue {
  data() {
    return {
      dupa: 'helloworld',
    }
  }
  async asyncData() {
    const dupa = await axios.get('api/v1/services')
    return { dupa: dupa.data }
  }
}
</script>
<style scoped>
</style>
