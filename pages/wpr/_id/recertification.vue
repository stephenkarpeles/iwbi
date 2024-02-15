<template>
  <div>
    <div v-if="!loading">
      <NavBreadcrumbs>
        <WHeadingsHTwo heading="WELL Health-Safety Rating" />
        <WStepsHorizontal :steps="steps" @stepsUpdated="changeStep" />
      </NavBreadcrumbs>
      <SharedRConfirmEnrollmentFees
        v-if="activeTab === 'CONFIRM FEES'"
      ></SharedRConfirmEnrollmentFees>
      <SharedRTerms v-if="activeTab === 'TERMS'"></SharedRTerms>
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
          name: 'TELL US ABOUT',
          status: 'complete',
        },
        {
          name: 'ENROLLMENT TYPE',
          status: 'complete',
        },
        {
          name: 'LOCATIONS',
          status: 'complete',
        },
        {
          name: 'TERMS',
          status: '',
        },
        {
          name: 'CONFIRM FEES',
          status: '',
        },
      ],
    }
  },
  head() {
    return 'Confirm your renewal fees'
  },
  computed: {
    ...mapState({
      sharedWorkspace: (state) => state.shared.sharedWorkspace,
      recertificationList: (state) => state.recertification.recertificationList,
      currentUser: (state) => state.user.currentUser,
      activeTab: (state) => state.shared.activeTab,
    }),
    recertification() {
      let recertifiction = ''
      if (this.recertificationList.length !== 0) {
        const lastRecertifiction = this.recertificationList.length - 1
        recertifiction = this.recertificationList[lastRecertifiction]
      }
      return recertifiction
    },
    recertificationPaymentStatus() {
      if (this.recertification) {
        return this.recertification.payment_status // check cert_status , if there is no value in cert_status, we should not redirect them to dashboard
      }
      return ''
    },
  },
  watch: {
    activeTab() {
      this.setNavBarRenew()
    },
  },
  async created() {
    let redirect = false
    this.loading = true
    await this.$store.dispatch('shared/getSharedWorkspace', {
      id: this.$route.params.id,
    })
    await this.$store.dispatch('recertification/getHSRRecertification')
    if (this.sharedWorkspace && this.recertificationPaymentStatus === 'paid') {
      redirect = true
      this.$router.push(
        `/shared-workspaces/${this.sharedWorkspace.portfolio_number}/dashboard`
      )
    }
    if (this.sharedWorkspace && this.sharedWorkspace.no_of_assets > 1) {
      if (
        this.recertificationPaymentStatus &&
        this.recertificationPaymentStatus === 'unpaid'
      ) {
        redirect = true
        this.$router.push(
          `/shared-workspaces/${this.sharedWorkspace.portfolio_number}/billing`
        )
      }
    }
    if (!redirect) {
      this.setNavBarRenew()
    }
    this.loading = false
  },

  methods: {
    ...mapActions('shared', ['setActiveTab']),
    changeStep(step) {
      if (step.status !== '') {
        this.setActiveTab(step.name)
      }
    },
    setNavBarRenew() {
      if (!this.recertification) {
        this.steps[3].status = 'current'
        this.$store.dispatch('shared/setActiveTab', 'TERMS')
      } else if (this.recertification.aggrement) {
        this.steps[3].status = 'complete'
        this.steps[3 + 1].status = 'current'
        this.$store.dispatch('shared/setActiveTab', 'CONFIRM FEES')
      }
    },
  },
}
</script>
``
