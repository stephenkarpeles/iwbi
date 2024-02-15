<template>
  <div>
    <div class="hidden sm:block">
      <nav
        class="relative z-0 rounded-lg shadow flex divide-x divide-gray-200"
        aria-label="Tabs"
      >
        <button
          v-for="(tab, index) in tabs"
          :key="index"
          :class="[
            tab.value === currentTab
              ? 'text-primary-900'
              : 'text-primary-700 hover:text-primary-800',
            `group relative min-w-0 flex-1 overflow-hidden bg-white py-8 px-4 text-sm font-medium text-center hover:bg-gray-50 focus:z-10 ${calculateCurve(
              index
            )}`,
          ]"
          @click="currentTab = tab.value"
        >
          <span class="text-base">{{ tab.name }}</span>
          <span
            v-if="tab.isActive"
            class="bg-primary-600 text-white py-1 px-3 rounded-full absolute top-2 right-2"
            >Active</span
          >
          <span
            aria-hidden="true"
            :class="[
              tab.value === currentTab ? 'bg-primary-600' : 'bg-transparent',
              'absolute inset-x-0 bottom-0 h-0.5 w-full',
            ]"
          />
        </button>
      </nav>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    tabs: {
      type: Array,
      default() {
        return []
      },
    },
  },
  data() {
    return {
      currentTab: this.tabs[0].name,
    }
  },
  watch: {
    currentTab() {
      this.$emit('input', this.currentTab)
    },
  },
  created() {
    this.currentTab = this.tabs[0].value
    this.$emit('input', this.currentTab)
  },
  methods: {
    calculateCurve(index) {
      if (this.tabs.length === 1) {
        return 'rounded-t-md'
      }
      if (index === this.tabs.length - 1) {
        return 'rounded-tr-md'
      } else if (index === 0) {
        return 'rounded-tl-md'
      }
    },
  },
}
</script>
