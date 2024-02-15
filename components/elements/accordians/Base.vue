<template>
  <div :class="[`bg-white border border-${type}-300 rounded-lg md:shadow-lg`]">
    <div
      :class="[
        isExpanded
          ? `rounded-t-lg bg-${type}-600 text-white`
          : `rounded-lg text-${type}-500 md:text-${type}-700`,
        `my-auto mx-auto cursor-pointer text-center px-4 py-2 md:py-4 hover:bg-${type}-700 hover:text-white transition-colors duration-200`,
      ]"
      @click="isExpanded = !isExpanded"
    >
      {{ label }}
    </div>
    <div v-if="isExpanded" class="p-4">
      <slot name="content" />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    label: {
      type: String,
      required: false,
      default: null,
    },
    expanded: {
      type: Boolean,
      required: false,
      default: false,
    },
    type: {
      type: String,
      required: false,
      default: 'primary',
    },
  },
  data() {
    return {
      isExpanded: false,
    }
  },
  mounted() {
    this.isExpanded = this.expanded
  },
}
</script>
