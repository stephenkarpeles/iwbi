<template>
  <div>
    <div v-if="!loading">
      <NavBreadcrumbs>
        <WHeadingsHTwo heading="WELL Health-Safety Rating" />
        <WStepsHorizontal :steps="steps" @stepsUpdated="changeStep" />
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
      <SharedPayment
        v-if="activeTab === 'PAYMENT' && $store.state.shared.allInvoices.length"
      ></SharedPayment>
      <!-- <SharedInvoice v-if="activeTab === 'INVOICE'"></SharedInvoice> -->
    </div>
    <div v-if="loading" class="text-center">
      <WLoadingSpinner class="mx-auto" />
      <div class="mt-3 text-primary-600">Loading WELL shared-workspace...</div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
  data() {
    return {
      loading: false,
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
      sharedWorkspace: (state) => state.shared.sharedWorkspace,
      currentUser: (state) => state.user.currentUser,
      activeTab: (state) => state.shared.activeTab,
      allInvoices: (state) => state.shared.allInvoices,
    }),
  },
  watch: {
    activeTab(value) {
      const stepIndex = this.steps.findIndex((a) => a.name === value)
      if (stepIndex) {
        if (this.steps[stepIndex].status !== 'complete') {
          this.steps[stepIndex].status = 'current'
        }
        for (let index = stepIndex; index > 0; index--) {
          this.steps[index - 1].status = 'complete'
        }
      }
    },
  },
  async created() {
    this.loading = true
    await this.$store
      .dispatch('shared/getSharedWorkspace', {
        id: this.$route.params.id,
      })
      .then((response) => {
        if (response.hsr_status === 'achieved') {
          this.setNavBarRenew()
          this.loading = false
        } else if (
          response.hsr_payment === 'paid' ||
          response.hsr_payment === 'waived'
        ) {
          this.$router.push(
            `/shared-workspaces/${this.$route.params.id}/dashboard`
          )
        } else {
          this.setNavBar()
          this.loading = false
        }
      })
    if (this.$route.query.prelim) {
      this.steps = [
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
      ]
      this.setActiveTab('ORGANISATION INFORMATION')
    }
  },
  beforeDestroy() {
    this.$store.dispatch('shared/resetAllVariables')
  },
  methods: {
    ...mapActions('shared', ['setActiveTab']),
    changeStep(step) {
      if (step.status !== '') {
        this.setActiveTab(step.name)
      }
    },
    setNavBar() {
      if (this.sharedWorkspace.area === 0) {
        this.steps[1].status = 'current'
        this.setActiveTab('ENROLLMENT TYPE')
      } else if (this.sharedWorkspace.hsr_aggrement) {
        this.setActiveTab('PAYMENT')
        this.steps[5].status = 'current'
      } else {
        this.steps[3].status = 'current'
        this.setActiveTab('FEES + DISCOUNTS')
      }
    },
    setNavBarRenew() {
      const termIndex = this.steps.findIndex(
        (a) => a.name === 'FEES + DISCOUNTS'
      )
      if (this.sharedWorkspace.hsr_aggrement) {
        this.steps[termIndex - 1].status = 'complete'
        this.steps[termIndex].status = 'current'
        this.steps[termIndex + 1].status = ''
        this.setActiveTab('FEES + DISCOUNTS')
      }
    },
  },
}
</script>
