<template>
  <div class="inline-flex items-center justify-center rounded-full">
    <svg class="mx-auto my-auto" :height="radius * 2" :width="radius * 2">
      <circle
        class="text-gray-300"
        stroke-width="4"
        stroke="currentColor"
        fill="transparent"
        :r="normalizedRadius"
        :cx="radius"
        :cy="radius"
      />
      <circle
        class="text-green-500 transition-all duration-300"
        stroke-width="4"
        :stroke-dasharray="circumference + ' ' + circumference"
        :stroke-dashoffset="strokeDashoffset"
        stroke="currentColor"
        fill="transparent"
        :r="normalizedRadius"
        :cx="radius"
        :cy="radius"
      />
    </svg>
  </div>
</template>

<script>
export default {
  props: {
    radius: {
      type: Number,
      required: false,
      default() {
        return 0
      },
    },
    stroke: {
      type: Number,
      required: false,
      default() {
        return 0
      },
    },
    progress: {
      type: Number,
      required: false,
      default() {
        return 0
      },
    },
  },
  data() {
    return {}
  },
  computed: {
    normalizedRadius() {
      return this.radius - this.stroke * 2
    },
    circumference() {
      return this.normalizedRadius * 2 * Math.PI
    },
    strokeDashoffset() {
      if (this.progress >= 100) {
        return this.circumference - 1 * this.circumference
      }
      return this.circumference - (this.progress / 100) * this.circumference
    },
  },
}
</script>
