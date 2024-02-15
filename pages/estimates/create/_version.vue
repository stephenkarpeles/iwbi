<template>
  <div>
    <EstimateV1UserEdit
      v-if="$route.params.version === 'v1'"
      :mode="'creation'"
    />
    <EstimateV2UserEdit
      v-if="$route.params.version === 'v2'"
      type="v2"
      :mode="'creation'"
    />
    <EstimateV2UserEdit
      v-if="$route.params.version === 'v2-pilot'"
      type="v2-pilot"
      :mode="'creation'"
    />
  </div>
</template>
<script>
export default {
  auth: false,
  head() {
    return {
      title: `Create an Estimate`,
    }
  },
}
</script>
