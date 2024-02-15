<template>
  <div>
    <div v-if="activeTab">
      <NavBreadcrumbs>
        <WHeadingsHTwo heading="WELL Performance Rating" />
        <WStepsHorizontal :steps="steps" />
      </NavBreadcrumbs>
      <WPRTellUsAbout
        v-if="activeTab === 'ORGANISATION INFORMATION'"
      ></WPRTellUsAbout>
      <WPREnrollmentType
        v-if="activeTab === 'ENROLLMENT TYPE'"
      ></WPREnrollmentType>
      <WPRLocation v-if="activeTab === 'LOCATION INFORMATION'"></WPRLocation>
      <WPREnrollmentFees
        v-if="activeTab === 'FEES + DISCOUNTS'"
      ></WPREnrollmentFees>
      <WPRTerms v-if="activeTab === 'TERMS + CONDITIONS'"></WPRTerms>
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
      title: `Create a performance rating`,
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
          `/invoice/${this.allInvoices[0].invoice_number}?redirect=/wpr/create/${this.sharedWorkspace.portfolio_number}`
        )
      }
    },
  },
  created() {
    this.$store.dispatch('shared/setActiveTab', 'ORGANISATION INFORMATION')
  },
}
</script>
