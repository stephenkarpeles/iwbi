<template>
  <div @mouseover="isActive = true" @mouseleave="isActive = false">
    <slot name="content" />
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
    currentTab: { type: String, default: null },
    drawerIsOpen: { type: Boolean, default: false },
  },
  data() {
    return {
      isActive: this.show,
    }
  },
}
</script>
