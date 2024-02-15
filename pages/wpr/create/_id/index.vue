<template>
  <div>
    <div v-if="!loading && activeTab">
      <NavBreadcrumbs>
        <WHeadingsHTwo heading="WELL Performance Rating" />
        <WStepsHorizontal :steps="steps" @stepsUpdated="changeStep" />
      </NavBreadcrumbs>
      <WPRTellUsAbout
        v-if="activeTab === 'ORGANIZATION INFORMATION'"
      ></WPRTellUsAbout>
      <WPRLocation
        v-if="
          activeTab === 'LOCATION INFORMATION' ||
          activeTab === 'ENROLLMENT TYPE'
        "
      ></WPRLocation>
      <WPREnrollmentFees
        v-if="activeTab === 'FEES + DISCOUNTS'"
      ></WPREnrollmentFees>
      <WPRTerms v-if="activeTab === 'TERMS + CONDITIONS'"></WPRTerms>
      <WPRPayment
        v-if="activeTab === 'PAYMENT' && $store.state.shared.allInvoices.length"
      ></WPRPayment>
    </div>
    <div v-if="loading" class="text-center">
      <WLoadingSpinner class="mx-auto" />
      <div class="mt-3 text-primary-600">
        Loading WELL Performance Rating...
      </div>
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
          name: 'ORGANIZATION INFORMATION',
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
      sharedWorkspace: (state) => state.shared.sharedWorkspace,
      currentUser: (state) => state.user.currentUser,
      activeTab: (state) => state.shared.activeTab,
      allInvoices: (state) => state.shared.allInvoices,
    }),
  },
  watch: {
    activeTab(value) {
      if (value !== null) {
        const stepIndex = this.steps.findIndex((a) => a.name === value)
        if (stepIndex) {
          if (this.steps[stepIndex].status !== 'complete') {
            this.steps[stepIndex].status = 'current'
          }
          for (let index = stepIndex; index > 0; index--) {
            this.steps[index - 1].status = 'complete'
          }
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
        if (response.wpr_status === 'achieved') {
          this.setNavBarRenew()
          this.loading = false
        } else if (
          response.wpr_payment === 'paid' ||
          response.wpr_payment === 'waived'
        ) {
          // this.$router.push(`/wpr/${this.$route.params.id}/dashboard`)
        } else {
          this.setNavBar()
          this.loading = false
        }
      })
    if (this.$route.query.prelim) {
      this.steps = [
        {
          name: 'ORGANIZATION INFORMATION',
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
      ]
      this.setActiveTab('ORGANIZATION INFORMATION')
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
        this.setActiveTab('LOCATION INFORMATION')
      } else if (this.sharedWorkspace.wpr_aggrement) {
        this.setActiveTab('PAYMENT')
        this.steps[4].status = 'current'
      } else {
        this.steps[3].status = 'current'
        this.setActiveTab('FEES + DISCOUNTS')
      }
    },
    setNavBarRenew() {
      const termIndex = this.steps.findIndex(
        (a) => a.name === 'FEES + DISCOUNTS'
      )
      if (this.sharedWorkspace.wpr_aggrement) {
        this.steps[termIndex - 1].status = 'complete'
        this.steps[termIndex].status = 'current'
        this.steps[termIndex + 1].status = ''
        this.setActiveTab('FEES + DISCOUNTS')
      }
    },
  },
}
</script>
