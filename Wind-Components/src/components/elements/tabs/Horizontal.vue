<template>
  <div>
    <div class="sm:hidden">
      <select
        v-model="currentTab"
        aria-label="Selected tab"
        class="form-select block w-full"
      >
        <option
          v-for="(tab, index) in tabs"
          :key="index"
          :selected="currentTab === tab.name"
          :value="tab.name"
        >
          {{ tab.name }}
        </option>
      </select>
    </div>
    <div class="hidden sm:block">
      <div class="border-b border-gray-200">
        <nav
          :class="$attrs.alignment != null ? $attrs.alignment : null"
          class="-mb-px flex px-5 lg:px-8"
        >
          <WButtonsBase
            v-for="(tab, index) in tabs"
            :key="index"
            :type="value === tab.name ? 'tabSelected' : 'tab'"
            :icon="tab.icon != null ? tab.icon : null"
            @click.native="currentTab = tab.name"
          >
            {{ tab.name }}
          </WButtonsBase>
        </nav>
      </div>
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
    value: {
      type: String,
      required: false,
      default: '',
    },
    defaultTab: {
      type: String,
      required: false,
      default: '',
    },
  },
  data() {
    return {
      currentTab: this.defaultTab ? this.defaultTab : this.tabs[0].name,
    }
  },
  watch: {
    currentTab() {
      this.$emit('input', this.currentTab)
    },
  },
  created() {
    this.$emit('input', this.currentTab)
  },
}
</script>
