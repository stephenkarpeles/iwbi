<template>
  <div class="w-full">
    <label
      v-if="name != null"
      :class="[
        'block text-sm font-medium leading-5 text-gray-700',
        { 'text-danger-300': error },
      ]"
    >
      {{ name }}
    </label>
    <div class="mt-1 rounded-md shadow-sm">
      <input
        :type="type"
        :required="required"
        :class="[
          'appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5',
          { 'border-danger-300': error },
        ]"
        @input="$emit('input', $event.target.value)"
      />
    </div>
  </div>
</template>
<script>
export default {
  inheritAttrs: false,
  props: {
    error: {
      type: [Boolean, String],
      default: false,
    },
    type: {
      type: String,
      default: null,
    },
    required: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      default: null,
    },
    id: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      value: '',
    }
  },
  methods: {
    changed() {},
  },
}
</script>
