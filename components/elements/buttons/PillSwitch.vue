<template>
  <div class="flex w-32">
    <button
      :class="`${value === 'now' ? 'bg-primary-600 text-white' : ''}
        border-2 border-primary-400
        rounded-l-full
        px-4
        py-1
      `"
      @click="isActive = 'now'"
    >
      Now
    </button>
    <button
      :class="`px-4 py-1 border-2 border-primary-400 rounded-r-full ${
        value === 'later' ? 'bg-primary-600 text-white' : ''
      }`"
      @click="isActive = 'later'"
    >
      Later
    </button>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      required: false,
      default: null,
    },
  },
  data() {
    return {
      isActive: null,
    }
  },
  watch: {
    isActive() {
      this.$emit('input', this.isActive)
    },
    value() {
      this.isActive = this.value
      this.$emit('input', this.isActive)
    },
  },
  created() {
    this.isActive = this.value
  },
}
</script>
