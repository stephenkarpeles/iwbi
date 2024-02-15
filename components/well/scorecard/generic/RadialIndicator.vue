<template>
  <!-- eslint-disable-next-line prettier/prettier -->
  <div class="flex relative w-max rounded-full" style="box-shadow: inset 0px -1.39706px 0px #FFFFFF, inset 0px 2.79412px 6.98529px -1.39706px rgba(88, 125, 138, 0.3);">
    <!-- <div
      class="absolute bg-primary-200 bg-red-400 origin-center rounded-full transform translate-x-1/3 translate-y-1/3"
      :style="{ height: radius + stroke + 'px', width: radius + stroke + 'px' }"
    ></div> -->
    <svg class="mx-auto my-auto" :height="radius * 2" :width="radius * 2">
      <circle
        class="transition-all duration-300"
        :stroke="color"
        :stroke-dasharray="circumference + ' ' + circumference"
        :style="{ strokeDashoffset: strokeDashoffset }"
        :stroke-width="stroke"
        :fill="fill"
        :r="normalizedRadius"
        :cx="radius"
        :cy="radius"
      />
    </svg>
    <div class="flex rounded-full w-full h-full absolute">
      <!-- eslint-disable-next-line prettier/prettier -->
      <div class="shadow-md text-sm my-auto mx-auto flex w-10 text-center h-10 bg-primary-100 rounded-full" style="background: linear-gradient(176.07deg, #FFFFFF 3.22%, #DBE6EA 124.91%);">
        <div class="font-bold text-primary-800 mx-auto my-auto">
          <span v-if="progress >= 100"> 100% </span>
          <span v-else> {{ Math.round(progress) }}% </span>
        </div>
      </div>
    </div>
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
    progress: {
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
    fill: {
      type: String,
      required: false,
      default() {
        return 'blue'
      },
    },
    color: {
      type: String,
      required: false,
      default() {
        return 'red'
      },
    },
  },
  data() {
    const normalizedRadius = this.radius - this.stroke * 2
    const circumference = normalizedRadius * 2 * Math.PI

    return {
      normalizedRadius,
      circumference,
    }
  },
  computed: {
    strokeDashoffset() {
      if (this.progress >= 100) {
        return this.circumference - 1 * this.circumference
      }
      return this.circumference - (this.progress / 100) * this.circumference
    },
  },
}
</script>
<style scoped></style>
