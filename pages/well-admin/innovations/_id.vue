<template>
  <div>
    <WLinksBase link="/well-admin/innovations" icon="arrow-narrow-left">
      Back to Innovations
    </WLinksBase>
    <WellAdminInnovationsLanding v-if="mode === 'landing'" />
    <WellAdminInnovationsEdit v-if="mode === 'edit'" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      mode: 'landing',
    }
  },
}
</script>
