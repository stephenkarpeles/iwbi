<template>
  <div>
    <div>
      <WLinksBase
        v-if="$route.query.redirect"
        :link="getRoute()"
        icon="arrow-narrow-left"
      >
        Back
      </WLinksBase>
      <InvoiceScreen
        v-if="invoice && $route.params.redirect"
        :invoice="invoice"
        :current-user="currentUser"
        :redirect-path="$route.params.redirect"
      />
      <InvoiceScreen
        v-else-if="invoice && $route.query.redirect"
        :invoice="invoice"
        :current-user="currentUser"
        :redirect-path="$route.query.redirect"
      />
      <InvoiceScreen
        v-else-if="invoice && !$route.query.redirect && !$route.params.redirect"
        :invoice="invoice"
        :current-user="currentUser"
      />
      <div v-else>No Invoice ID was given</div>
    </div>
  </div>
</template>
<script>
export default {
  auth: false,
  async asyncData({ store, redirect, $axios, params }) {
    let invoice = null

    if (params.invoiceNumber) {
      invoice = await $axios.get(
        'api/invoice/' + params.invoiceNumber + '/getByNumber'
      )

      invoice = invoice.data
    }

    return {
      invoice,
      currentUser: store.state.user.currentUser,
    }
  },

  data() {
    return {
      invoiceNumber: this.$route.params.invoiceNumber,
    }
  },
  head() {
    return {
      title: `Invoice #${this.invoiceNumber}`,
    }
  },
  methods: {
    getRoute() {
      return this.$route.query.redirect
    },
  },
}
</script>
