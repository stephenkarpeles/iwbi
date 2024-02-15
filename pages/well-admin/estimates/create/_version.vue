<template>
  <div>
    <EstimateV1Edit
      v-if="this.$route.params.version === 'v1'"
      :mode="'creation'"
    />
    <EstimateV2Edit
      v-if="this.$route.params.version === 'v2'"
      type="v2"
      :mode="'creation'"
    />
    <EstimateV2Edit
      v-if="this.$route.params.version === 'v2-pilot'"
      type="v2-pilot"
      :mode="'creation'"
    />
  </div>
</template>
<script>
export default {
  head() {
    return {
      title: `Create an Estimate`,
    }
  },
}
</script>
