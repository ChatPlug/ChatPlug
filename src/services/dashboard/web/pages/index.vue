<template>
    <section>
        <v-btn nuxt to="instances/">See instances</v-btn>
    </section>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { State, namespace, Action } from 'vuex-class'

@Component({})
export default class extends Vue {
  created() {
    this.$router.push('/instances') // temporary redirect until we make a proper front page
  }
}
</script>
<style scoped>
</style>
