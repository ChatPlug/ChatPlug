<template>
  <div>
    <v-text-field :label="label" ref="inp" :value="internalValue" @input="internalValue = $event" @blur="emitValue" @keyup.enter="$refs.inp.blur()" @keyup.esc="discardValue" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      internalValue: ""
    };
  },
  watch: {
    value(newVal) {
      this.internalValue = newVal;
    }
  },
  methods: {
    emitValue() {
      this.$emit("input", this.internalValue);
    },
    discardValue() {
      this.internalValue = this.value;
      this.$refs.inp.blur();
    }
  },
  created() {
    this.internalValue = this.value;
  },
  props: {
    value: {
      type: String,
      default: ""
    },
    label: {
      type: String,
      default: ""
    }
  }
};
</script>

<style>
</style>
