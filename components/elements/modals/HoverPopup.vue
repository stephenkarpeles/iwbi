<template>
  <div class="rounded-md text-center w-80">
    <div class="h-10 bg-primary-100 justify-center text-xl flex items-center">
      <slot name="title"></slot>
    </div>
    <div class="px-4 text-sm text-gray-500 py-3">
      <div>
        <div class="text-sm">
          <slot name="description"> </slot>
        </div>
        <span
          v-if="$slots.focusText"
          class="block text-sm mt-6 text-primary-400"
        >
          <slot name="focusText"></slot>
        </span>
        <span class="block text-xs">
          <slot name="additionalOption"> </slot>
        </span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {}
  },
}
</script>
