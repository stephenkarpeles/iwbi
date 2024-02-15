<template>
  <div>
    <div v-if="exam">
      <NavBreadcrumbs>
        <WHeadingsHTwo class="mb-2" heading="WELL AP Exam Registration" />
        <WStepsHorizontal
          :steps="[
            {
              name: 'REGISTER HERE',
              status: 'complete',
              link: '/well-ap/register',
            },
            {
              name: 'MAKE THE COMMITMENT',
              status: 'current',
              link: '/well-ap/invoice',
            },
            {
              name: 'EXAM DASHBOARD',
              status: '',
              link: '/well-ap/materials',
            },
          ]"
        />
      </NavBreadcrumbs>
      <InvoiceScreen
        :invoice="exam.invoices[0]"
        :current-user="currentUser"
        :redirect-path="'/well-ap/dashboard?purchased=true'"
      />
    </div>
    <div v-else class="h-screen w-full mt-14">
      <div class="mx-auto text-center">
        <WLoadingSpinner class="mx-auto" />
        <div class="mt-3 text-primary-600">Loading Invoice...</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  async asyncData({ store, redirect }) {
    await Promise.all([store.dispatch('exam/getExams')])

    // if (
    //   store.state.exam.exam.invoices === undefined ||
    //   store.state.exam.exam.invoices.length === 0
    // ) {
    //   redirect('/well-ap/pricing')
    // }

    return {
      exam: store.state.exam.exam,
      currentUser: store.state.user.currentUser,
    }
  },
  head() {
    return {
      title: `WELL AP Invoice`,
    }
  },
}
</script>
