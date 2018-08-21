<template>
  <div class="ba b--black-20 mw5 ma2">
    <div class="flex flex-column items-center pa2 b--black-20">
      <div class="f4">{{ instance.moduleName }} {{ person.instanceName }}</div>
      <button class="w-100 bg-blue dim mv2 pv2 bn pointer">Select</button>
    </div>
  </div>
</template>

<script lang="ts">

import Vue from 'vue'
import { Component, Prop } from 'nuxt-property-decorator'
import { Action, namespace } from 'vuex-class'

@Component({})
class ServiceInstanceCard extends Vue {
  @Prop() instance
}
</script>
