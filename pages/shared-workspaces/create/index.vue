<template>
  <div>
    <div>
      <NavBreadcrumbs>
        <WHeadingsHTwo heading="WELL Health-Safety Rating" />
        <WStepsHorizontal :steps="steps" />
      </NavBreadcrumbs>
      <SharedTellUsAbout
        v-if="activeTab === 'ORGANISATION INFORMATION'"
      ></SharedTellUsAbout>
      <SharedEnrollmentType
        v-if="activeTab === 'ENROLLMENT TYPE'"
      ></SharedEnrollmentType>
      <SharedLocation
        v-if="activeTab === 'LOCATION INFORMATION'"
      ></SharedLocation>
      <SharedEnrollmentFees
        v-if="activeTab === 'FEES + DISCOUNTS'"
      ></SharedEnrollmentFees>
      <SharedTerms v-if="activeTab === 'TERMS + CONDITIONS'"></SharedTerms>
      <!-- <SharedInvoice v-if="activeTab === 'INVOICE'"></SharedInvoice> -->
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  asyncData({ store }) {
    return {
      currentUser: store.state.user.currentUser,
    }
  },
  data() {
    return {
      steps: [
        {
          name: 'ORGANISATION INFORMATION',
          status: 'current',
        },
        {
          name: 'ENROLLMENT TYPE',
          status: '',
        },
        {
          name: 'LOCATION INFORMATION',
          status: '',
        },
        {
          name: 'FEES + DISCOUNTS',
          status: '',
        },
        {
          name: 'TERMS + CONDITIONS',
          status: '',
        },
        {
          name: 'PAYMENT',
          status: '',
        },
      ],
    }
  },
  head() {
    return {
      title: `Create a Shared Workspace`,
    }
  },
  computed: {
    ...mapState({
      activeTab: (state) => state.shared.activeTab,
      allInvoices: (state) => state.shared.allInvoices,
      sharedWorkspace: (state) => state.shared.sharedWorkspace,
    }),
  },
  watch: {
    activeTab(value) {
      const stepIndex = this.steps.findIndex((a) => a.name === value)
      if (stepIndex) {
        for (let index = stepIndex; index > 0; index--) {
          this.steps[index - 1].status = 'complete'
        }
      }
      if (value === 'INVOICE') {
        this.$router.push(
          `/invoice/${this.allInvoices[0].invoice_number}?redirect=/shared-workspaces/create/${this.sharedWorkspace.portfolio_number}`
        )
      }
    },
  },
  created() {
    this.$store.dispatch('shared/setActiveTab', 'ORGANISATION INFORMATION')
  },
}
</script>
