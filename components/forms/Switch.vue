<template>
  <div>
    <div
      class="flex rounded-full w-10 h-4 transition-all duration-1000"
      :class="{
        'bg-primary-600 justify-end': value,
        'bg-gray-400 justify-start': !value,
      }"
      @click="changeSwitchValue"
    >
      <div class="bg-white rounded-full w-4 h-4"></div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    changeSwitchValue() {
      this.$store.dispatch('portfolio/updateAnalyzeMode', !this.value)
    },
  },
}
</script>
