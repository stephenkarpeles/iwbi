<template>
  <div class="mt-3 inline-flex rounded-md sm:mt-0">
    <div
      class="w-full absolute text-left hover:cursor-pointer"
      @mouseover="isActive = true"
      @mouseleave="isActive = false"
    >
      <slot />
      <div
        :class="[
          x && y
            ? x === 'left'
              ? 'origin-right right-0'
              : 'origin-left left-0'
            : 'center',
          x && y
            ? y === 'top'
              ? 'top-0 transform -translate-y-full'
              : 'bottom-0 transform translate-y-full'
            : 'center',
          'absolute rounded-md z-40 animate__animated animate__fadeIn animate__faster',
          { hidden: !isActive },
          additionalClasses,
        ]"
      >
        <div
          class="
            relative
            rounded-md
            relative
            bg-white
            shadow-2xl
            relative
            mt-3
            -ml-10
          "
        >
          <div
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
            class="py-0 shadow rounded"
          >
            <slot name="content" />
          </div>
        </div>
        <div
          v-if="showTriangle"
          :class="[
            'triangle absolute top-0 left-0 mt-1 -mb-5 -ml-1 z-50',
            { hidden: !isActive },
          ]"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    additionalClasses: {
      type: String,
      default() {
        return ''
      },
    },
    links: {
      type: Object,
      default() {
        return {}
      },
    },
    show: {
      type: Boolean,
      default: false,
    },
    x: {
      type: [String, Boolean],
      default: 'left',
    },
    y: {
      type: [String, Boolean],
      default: 'bottom',
    },
    showTriangle: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      isActive: this.show,
    }
  },
}
</script>
<style>
.triangle {
  width: 0;
  height: 0;
  border-bottom: 20px solid #fff;
  border-left: 15px solid transparent;
  border-right: 15px solid transparent;
}
</style>
