<template>
  <div>
    <div v-if="estimateData">
      <div class="mb-5 flex justify-end">
        <div class="flex space-x-2">
          <WButtonsBase
            type="primaryInverted"
            icon="download"
            @click.native="
              project.type === 'v2' || project.type === 'v2-pilot'
                ? $store.dispatch('estimate/downloadEstimate', estimate.id)
                : $store.dispatch('estimate/downloadV1Estimate', estimate.id)
            "
          >
            Download
          </WButtonsBase>
          <WButtonsBase
            v-if="
              currentUser.role.includes('well-admin') &&
              project.type !== 'v2-pilot-upgraded'
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
          v-if="project.type === 'v1' || project.type === 'v1-upgraded'"
          :estimate="estimateData"
        />
        <EstimateV2View
          v-if="project.type === 'v2' || project.type === 'v2-pilot-upgraded'"
          :estimate="estimateData"
        />
        <EstimateV2PilotView
          v-if="project.type === 'v2-pilot'"
          :estimate="estimateData"
        />
      </div>
      <div v-else>
        <EstimateV1Edit
          v-if="project.type === 'v1' || project.type === 'v1-upgraded'"
          :estimate="estimateData"
        />
        <EstimateV2Edit v-if="project.type === 'v2'" :estimate="estimateData" />
        <EstimateV2PilotEdit
          v-if="project.type === 'v2-pilot'"
          :estimate="estimateData"
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
  props: {
    estimate: {
      type: Object,
      required: false,
      default: null,
    },
    project: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      editMode: false,
      estimateData: null,
    }
  },
  computed: {
    ...mapState({
      currentUser: (state) => state.user.currentUser,
    }),
  },
  mounted() {
    this.getEstimate()
  },
  methods: {
    async getEstimate() {
      if (this.project.type !== 'v1') {
        await this.$store
          .dispatch('estimate/getEstimate', this.estimate.id)
          .then((res) => {
            this.estimateData = res
          })
      } else {
        await this.$store
          .dispatch('estimate/getV1Estimate', this.estimate.id)
          .then((res) => {
            this.estimateData = res
          })
      }
    },
  },
}
</script>
