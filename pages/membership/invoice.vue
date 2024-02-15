<template>
  <div>
    <div>
      <NavBreadcrumbs>
        <WHeadingsHTwo class="mb-2" heading="Membership Registration" />
        <WStepsHorizontal
          :steps="[
            {
              name: 'SUBSCRIBE',
              status: 'complete',
            },
            {
              name: 'CONFIRMATION',
              status: 'complete',
            },
            {
              name: 'PAYMENT',
              status: 'current',
            },
          ]"
        />
      </NavBreadcrumbs>
      <InvoiceScreen
        :invoice="membershipInvoice"
        :current-user="currentUser"
        :redirect-path="'/membership/dashboard'"
      />
    </div>
  </div>
</template>
<script>
export default {
  async asyncData({ store, redirect }) {
    await Promise.all([
      store.dispatch('membership/getMembershipList'),
      store.dispatch('membership/getMembership'),
    ])

    return {
      membershipInvoice:
        store.state.membership.membership.subscriptions[0].invoices[0],
      currentUser: store.state.user.currentUser,
    }
  },
  head() {
    return {
      title: `Membership Invoice`,
    }
  },
}
</script>
