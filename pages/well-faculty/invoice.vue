<template>
  <div>
    <div>
      <NavBreadcrumbs>
        <WStepsHorizontal
          :steps="[
            {
              name: 'REGISTER HERE',
              status: 'complete',
              link: '/well-faculty/register',
            },
            {
              name: 'SUBMIT FOR REVIEW',
              status: 'complete',
              link: '/well-faculty/pricing',
            },
            {
              name: 'REVIEW RESULT',
              status: 'complete',
              link: '/well-faculty/invoice',
            },
            {
              name: 'PAY INVOICE',
              status: 'current',
              link: '/well-faculty/dashboard',
            },
          ]"
        />
      </NavBreadcrumbs>
      <WLinksBase
        type="navPrimary"
        link="/well-faculty/register"
        icon="arrow-narrow-left"
      >
        Back
      </WLinksBase>
      <InvoiceScreen
        v-if="faculty.invoices[0]"
        :invoice="faculty.invoices[0]"
        :current-user="currentUser"
        :redirect-path="'/well-faculty/dashboard'"
      />
    </div>
  </div>
</template>
<script>
export default {
  async asyncData({ store, redirect }) {
    await Promise.all([store.dispatch('faculty/getFaculty')])

    return {
      faculty: store.state.faculty.faculty,
      currentUser: store.state.user.currentUser,
    }
  },
  head() {
    return {
      title: `Faculty Invoice`,
    }
  },
}
</script>
