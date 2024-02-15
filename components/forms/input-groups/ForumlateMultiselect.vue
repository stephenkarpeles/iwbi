<template>
  <!-- eslint-disable vue/no-mutating-props -->
  <div
    :class="`formulate-input-element formulate-input-element--${context.type}`"
    :data-type="context.type"
  >
    <div class="mb-4 flex rounded-md shadow-sm">
      <multiselect
        v-model="contextModel"
        :options="context.options"
        :multiple="
          context.attributes.multiple ? context.attributes.multiple : false
        "
        :searchable="
          context.attributes.searchable ? context.attributes.searchable : false
        "
        :taggable="
          context.attributes.taggable ? context.attributes.taggable : false
        "
        :allow-empty="allowEmpty"
        :hide-selected="hideSelected"
        :show-labels="showLabels"
        :placeholder="
          context.attributes.placeholder ? context.attributes.placeholder : ''
        "
        :label="context.attributes.labels ? context.attributes.labels : 'label'"
        :track-by="
          context.attributes['track-by'] ? context.attributes['track-by'] : 'id'
        "
        :open-direction="'bottom'"
        @tag="addToRecipient"
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
      default: true,
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
      selectedVal: [],
    }
  },
  computed: {
    contextModel: {
      get() {
        if (this.context.model.label === null) {
          return []
        }
        return this.context.model
      },
      set(val) {
        // eslint-disable-next-line vue/no-mutating-props
        this.context.model = val
      },
    },
  },
  mounted() {
    this.selectedVal.push(this.context.model)
  },
  methods: {
    addToRecipient(newTag) {
      const tag = {
        label: newTag,
        value: newTag,
      }
      // eslint-disable-next-line vue/no-mutating-props
      this.context.options.push(tag)
      // eslint-disable-next-line vue/no-mutating-props
      this.context.model.push(tag)
    },
  },
}
</script>

<style>
.multiselect {
  color: #32748a !important;
  font-size: 0.875rem !important;
  line-height: 1.25rem !important;
}

.multiselect__input,
.multiselect__single {
  position: relative;
  display: inline-block;
  min-height: 20px;
  line-height: 20px;
  border: none;
  border-radius: 5px;
  background: #fff;
  padding: 1px 0 0 5px;
  width: calc(100%);
  transition: border 0.1s ease;
  box-sizing: border-box;
  margin-bottom: 8px;
  vertical-align: top;
  color: #32748a !important;
  font-size: 0.875rem !important;
  line-height: 1.25rem !important;
}
/* Input Field Styling */
.multiselect__tags {
  border: 1px solid #abd2df !important;
}

/* Search Results Text */
.multiselect__option {
  color: #32748a;
  background-color: white !important;
}
.multiselect__option::after {
  background: #32748a !important;
}
.multiselect__option--highlight {
  background: #32748a !important;
  outline: none;
  color: #fff;
}
.multiselect__tag {
  background: #bd907a !important;
}
.multiselect__tag-icon:after {
  color: white !important;
}
.multiselect__tag-icon:focus,
.multiselect__tag-icon:hover {
  background: #a77a65 !important;
}

.multiselect--active:not(.multiselect--above) .multiselect__input {
  border: none !important;
}
/* .multiselect--active:not(.multiselect--above) .multiselect__current {
  border: 1px solid red !important;
} */

.multiselect--active {
  border: none !important;
}

.multiselect--active:not(.multiselect--above) .multiselect__tags {
  outline: 1px solid rgb(47, 117, 247) !important;
}
</style>
