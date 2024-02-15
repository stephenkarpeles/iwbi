<template>
  <label
    class="ml-4 font-medium text-primary-700"
    :for="context.id"
    v-html="context.label"
  />
</template>

<script>
export default {
  props: {
    context: {
      type: Object,
      required: true,
    },
  },
}
</script>
