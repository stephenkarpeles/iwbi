<template>
  <div
    :class="`formulate-input-element formulate-input-element--${context.type}`"
    :data-type="context.type"
  >
    <div class="mt-1 mb-4 flex rounded-md shadow-sm">
      <multiselect
        v-model="selectedVal"
        :options="options"
        :multiple="multiple"
        :searchable="searchable"
        :allow-empty="allowEmpty"
        :hide-selected="hideSelected"
        :show-labels="showLabels"
        :placeholder="placeholder"
        label="label"
        :track-by="trackBy"
        :open-direction="'bottom'"
      >
      </multiselect>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    context: {
      type: Object,
      required: true,
    },
    options: {
      type: Array,
      required: true,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    searchable: {
      type: Boolean,
      default: false,
    },
    allowEmpty: {
      type: Boolean,
      default: true,
    },
    hideSelected: {
      type: Boolean,
      default: false,
    },
    showLabels: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: '',
    },
    trackBy: {
      type: String,
      default: 'id',
    },
  },
  data() {
    return {
      selectedVal: null,
    }
  },
  computed: {
    model() {
      return this.context.model
    },
  },
  watch: {
    dateVal(val) {
      if (val) {
        // eslint-disable-next-line
        this.context.model = val.value
      }
    },
  },
}
</script>
<style>
.multiselect__tags input {
  box-shadow: none !important;
  border: 0px !important;
}
</style>
