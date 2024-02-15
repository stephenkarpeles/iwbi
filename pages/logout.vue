<template>
  <div>
    <div class="mx-auto mt-5 text-center">
      <WLoadingSpinner class="mx-auto" />
      <div class="mt-3 text-primary-600">You are being logged out...</div>
    </div>
  </div>
</template>
<script>
export default {
  layout: 'blank',
  async mounted() {
    await this.$store.dispatch('authentication/logout')
  },
  head() {
    return {
      title: 'Logging out',
    }
  },
}
</script>
