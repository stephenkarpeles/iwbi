<template>
  <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
    <div class="overflow-x-scroll">
      <table class="w-full divide-y divide-gray-200">
        <thead class="bg-primary-700 text-white">
          <slot name="header"></slot>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <slot name="body"></slot>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      required: false,
      default: 'primary',
    },
  },
  data() {
    return {}
  },
}
</script>
