<template>
  <div>
    <div v-if="sharedWorkspace && sharedWorkspace.id">
      <WFeedbackAlert ref="alert" class="z-50" />
      <!-- HSR Renewal - Need to confirm locations Modal -->
      <WFeedbackModal
        v-if="recertification && recertification.location_changed === 1"
        ref="renewalInstructionModal"
        class="z-20 mt-12"
      >
        <div class="w-96">
          <div
            class="text-base text-center text-primary-900 leading-7 font-bold"
          >
            Please review the instructions in the locations tab before you
            add/remove/modify locations.
          </div>
        </div>
      </WFeedbackModal>
      <div class="relative bg-white rounded-lg">
        <SharedLocationsScreen />
      </div>
    </div>
    <div v-else>
      <div class="mx-auto text-center py-5">
        <WLoadingSpinner class="mx-auto" />
        <div class="mt-3 text-primary-600">
          Loading WELL Health-Safety Rating...
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  layout: 'sidebar',
  head() {
    return {
      title: `Health Safety Locations`,
    }
  },
  computed: {
    ...mapState({
      currentTab: (state) => state.settings.sidebarTab,
      sharedWorkspace: (state) => state.shared.sharedWorkspace,
      recertificationList: (state) => state.recertification.recertificationList,
      invoices: (state) => state.shared.allInvoices,
      currentUser: (state) => state.user.currentUser,
    }),
    recertification() {
      let recertifiction = ''
      if (this.recertificationList.length !== 0) {
        const lastRecertifiction = this.recertificationList.length - 1
        recertifiction = this.recertificationList[lastRecertifiction]
      }
      return recertifiction
    },
  },
  async mounted() {
    if (this.$route.query.tab) {
      this.$store.commit('settings/setSidebarTab', this.$route.query.tab)
    } else {
      this.$store.commit('settings/setSidebarTab', 'Locations')
    }

    await this.$store.dispatch('shared/getSharedWorkspace', {
      id: this.$route.params.id,
    })
    // Renewal Modal
    if (this.recertification && this.recertification.location_changed === 1) {
      this.$refs.renewalInstructionModal.isHidden = false
    }
  },
  beforeDestroy() {
    this.$store.dispatch('review/reset')
  },
}
</script>
