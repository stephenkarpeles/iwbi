<template>
  <div
    class="flex w-full bg-primary-200 h-2 rounded-full overflow-hidden shadow"
  >
    <div
      class="h-2 bg-secondary-700 rounded-full transition-all duration-200"
      :style="{ width: (category === 0 ? 0 : category) + '%' }"
    ></div>
  </div>
</template>
<script>
export default {
  props: {
    category: {
      type: Number,
      default() {
        return 0
      },
    },
  },
}
</script>
