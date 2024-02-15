<template>
  <div class="bg-white text-left divide-y divide-cool-gray-200">
    <div class="flex justify-between px-4" @click="isExpanded = !isExpanded">
      <div
        :class="[
          isExpanded ? 'text-primary-700 font-bold' : 'text-primary-500',
        ]"
        class="my-auto cursor-pointer py-2 hover:text-primary-700 transition-colors duration-200"
      >
        {{ label }}
      </div>
      <div>
        <svg
          v-if="!isExpanded"
          class="w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
        <svg
          v-else
          class="w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 15l7-7 7 7"
          />
        </svg>
      </div>
    </div>
    <div v-if="isExpanded" class="px-4 pt-2">
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
