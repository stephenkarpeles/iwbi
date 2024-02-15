<template>
  <div>
    <div v-if="estimate">
      <div class="mb-5 md:flex md:justify-end">
        <div class="md:flex md:space-x-2 space-y-3 md:space-y-0">
          <WButtonsBase
            type="primaryInverted"
            icon="download"
            @click.native="
              $route.params.version === 'v2' ||
              $route.params.version === 'v2-pilot'
                ? $store.dispatch('estimate/downloadEstimate', estimate.id)
                : $store.dispatch(
                    'estimate/downloadV1Estimate',
                    estimate.estimate.id
                  )
            "
          >
            Download
          </WButtonsBase>
          <WButtonsBase
            v-if="
              (currentUser && currentUser.role.includes('well-admin')) ||
              canEdit
            "
            type="primaryInverted"
            :icon="[editMode ? 'search-circle' : 'pencil']"
            @click.native="editMode = !editMode"
          >
            <span v-if="editMode">View</span>
            <span v-else>Edit</span>
          </WButtonsBase>
        </div>
      </div>
      <div v-if="!editMode">
        <EstimateV1View
          v-if="$route.params.version === 'v1' && !estimate.estimate.project_id"
          :estimate="estimate"
        />
        <EstimateV1ViewAlternative
          v-if="$route.params.version === 'v1' && estimate.estimate.project_id"
          :estimate="estimate"
        />
        <EstimateV2View
          v-if="$route.params.version === 'v2'"
          :estimate="estimate"
        />
        <EstimateV2PilotView
          v-if="$route.params.version === 'v2-pilot'"
          :estimate="estimate"
        />
      </div>
      <div v-else>
        <EstimateV1Edit
          v-if="$route.params.version === 'v1'"
          :estimate="estimate"
        />
        <EstimateV2Edit
          v-if="$route.params.version === 'v2'"
          :estimate="estimate"
        />
        <EstimateV2PilotEdit
          v-if="$route.params.version === 'v2-pilot'"
          :estimate="estimate"
        />
      </div>
    </div>
    <div v-else>
      <div class="mx-auto text-center">
        <WLoadingSpinner class="mx-auto" />
        <div class="mt-3 text-primary-600">Loading Estimate...</div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  auth: false,
  data() {
    return {
      estimate: null,
      editMode: false,
    }
  },
  head() {
    return {
      title: `${this.$route.params.version} Estimate #${this.$route.params.id}`,
    }
  },
  computed: {
    ...mapState({
      currentUser: (state) => state.user.currentUser,
    }),
    canEdit() {
      if (this.currentUser) {
        if (this.estimate.estimate) {
          if (this.currentUser.id === parseInt(this.estimate.estimate.user_id))
            return true
        }
        if (this.currentUser.id === parseInt(this.estimate.user_id)) return true
      }

      return false
    },
  },
  watch: {
    estimate(newValue) {
      if (newValue.type && newValue.type !== this.$route.params.version) {
        this.$router.push(
          `/estimates/${newValue.type}/${this.$route.params.id}`
        )
      }
    },
  },
  mounted() {
    this.getEstimate()
  },
  methods: {
    async getEstimate() {
      if (this.$route.params.version !== 'v1') {
        await this.$store
          .dispatch('estimate/getEstimate', this.$route.params.id)
          .then((res) => {
            this.estimate = res
          })
      } else {
        await this.$store
          .dispatch('estimate/getV1Estimate', this.$route.params.id)
          .then((res) => {
            this.estimate = res
          })
      }
    },
  },
}
</script>
