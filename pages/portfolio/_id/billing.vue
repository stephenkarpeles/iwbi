<template>
  <div v-if="portfolio && portfolio.id && invoices">
    <PortfolioBillingScreen :invoices="invoices" :portfolio="portfolio" />
  </div>
  <div v-else>
    <div class="mx-auto text-center py-5">
      <WLoadingSpinner class="mx-auto" />
      <div class="mt-3 text-primary-600">Loading Invoices...</div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  layout: 'sidebar',
  computed: {
    ...mapState({
      portfolio: (state) => state.portfolio.portfolio,
      invoices: (state) => state.portfolio.allInvoices,
    }),
  },
  async mounted() {
    if (this.$route.query.tab) {
      this.$store.commit('settings/setSidebarTab', this.$route.query.tab)
    } else {
      this.$store.commit('settings/setSidebarTab', 'Billing')
    }
    await this.$store.dispatch('portfolio/getPortfolio', {
      id: this.$route.params.id,
    })
    await this.$store.dispatch('portfolio/getInvoiceList')
  },
  beforeDestroy() {
    this.$store.commit('portfolio/setInvoiceDetails', null)
  },
  head() {
    return {
      title: `Portfolio Billing`,
    }
  },
}
</script>
