<template>
  <div class="w-full flex flex-wrap">
    <div v-for="(invoice, index) in allInvoices" :key="index" class="w-full">
      <InvoiceCard
        :invoice="invoice"
        :redirect="`/shared-workspaces/create/${sharedWorkspace.portfolio_number}`"
        type="registration"
        module="hsr"
      />
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState({
      sharedWorkspace: (state) => state.shared.sharedWorkspace,
      allInvoices: (state) => state.shared.allInvoices,
    }),
  },
  async beforeCreate() {
    await this.$store.dispatch('shared/getSharedWorkspace', {
      id: this.$route.params.id,
    })
  },
}
</script>
