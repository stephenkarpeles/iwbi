<template>
  <div>
    <div v-if="doneLoading">
      <div class="ml-64 pt-8 pr-72"></div>
      <div
        :class="[
          expanded ? 'ml-64  pr-72' : 'ml-16  pr-24',
          'shadow bg-white fixed z-10 left-0 mt-16 top-0 w-full py-4 px-11',
        ]"
      >
        <ChecklistFilterBar
          ref="filter-bar"
          :module-type="moduleType"
          :module="module"
        />
      </div>
      <ChecklistHeader
        v-if="moduleType !== 'wpr'"
        class="mt-10"
        :checklist="checklist"
        :parts="parts"
        :type="checklist.type"
        :module-type="moduleType"
        :module="module"
      />
      <ChecklistWprHeader
        v-else
        class="mt-10"
        :checklist="checklist"
        :parts="parts"
        :type="checklist.type"
        :module-type="moduleType"
        :module="module"
      />

      <div
        v-if="
          pendingReview &&
          ($store.state.user.currentUser.role.includes('well-admin') ||
            $store.state.user.currentUser.role.includes('external-reviewer'))
        "
        class="p-5 bg-primary-200 border-primary-600 rounded mb-5"
      >
        <div class="tex-xl font-bold">Project Team Review Comment:</div>
        <div class="text-sm">{{ pendingReview.comment }}</div>
      </div>
      <LazyWFeedbackModal ref="reportModal">
        <div v-if="reportDownloadLink" class="mx-auto text-center w-80">
          <div class="mt-3 text-primary-600 text-xl">
            Your report should be downloading
          </div>
          <div class="text-sm text-gray-400">
            If you report does not automatically download, please click
            <a
              :href="reportDownloadLink"
              target="_blank"
              class="text-primary-600"
            >
              here to manually download</a
            >
          </div>
          <div class="w-32 mx-auto mt-3">
            <WButtonsBase
              @click.native="
                ;($refs.reportModal.isHidden = true),
                  (reportDownloadLink = null)
              "
              >Close</WButtonsBase
            >
          </div>
        </div>
        <div v-else class="mx-auto text-center">
          <WLoadingSpinner class="mx-auto" />
          <div class="mt-3 text-primary-600">Generating your report...</div>
          <div class="text-sm text-gray-400">
            Please be patient, this may take a moment.
          </div>
        </div>
      </LazyWFeedbackModal>

      <table class="w-full mx-auto shadow divide-y">
        <thead>
          <tr>
            <th
              v-if="module.type === 'v2-pilot'"
              class="rounded-tl-lg w-12 py-3 bg-primary-700 text-left text-xs leading-4 font-medium text-white uppercase tracking-wider"
            ></th>
            <th
              :class="[
                module.type !== 'v2-pilot' && 'rounded-tl-lg',
                ' w-1/12 px-6 py-3 bg-primary-700 text-left text-xs leading-4 font-medium text-white uppercase tracking-wider',
              ]"
            >
              ID
            </th>
            <th
              class="w-6/12 px-6 py-3 bg-primary-700 text-left text-xs leading-4 font-medium text-white uppercase tracking-wider"
            >
              Feature
            </th>
            <th
              class="w-3/12 px-6 py-3 bg-primary-700 text-left text-xs leading-4 font-medium text-white uppercase tracking-wider"
            ></th>
            <th
              class="rounded-tr-lg px-6 py-3 bg-primary-700 text-left text-xs leading-4 font-medium text-white uppercase tracking-wider"
            >
              Pursuing
            </th>
          </tr>
        </thead>
        <tbody v-if="!loadingFeature" class="divide-y">
          <LazyChecklistTableRow
            v-for="part in parts"
            :id="'scorecard-part-' + part.id"
            :key="part.id"
            ref="table-row"
            :module-type="moduleType"
            :module="module"
            :show-icons="false"
            :part="part"
            :parts="parts"
            :active-concept="part.concept_name"
          />
        </tbody>
        <tbody v-else>
          <tr>
            <td colspan="5" class="p-2">
              <div
                class="bg-gray-400 mx-auto animate-pulse rounded w-full h-12"
              ></div>
            </td>
          </tr>
          <tr>
            <td colspan="5" class="p-2">
              <div
                class="bg-gray-300 mx-auto animate-pulse rounded w-full h-12"
                :style="{
                  animationFillMode: 'backwards',
                  animationDelay: '150ms',
                }"
              ></div>
            </td>
          </tr>
          <tr>
            <td colspan="5" class="p-2">
              <div
                class="bg-gray-200 mx-auto animate-pulse rounded w-full h-12"
                :style="{
                  animationFillMode: 'backwards',
                  animationDelay: '300ms',
                }"
              ></div>
            </td>
          </tr>
          <tr>
            <td colspan="5" class="p-2">
              <div
                class="bg-gray-100 mx-auto animate-pulse rounded w-full h-12"
                :style="{
                  animationFillMode: 'backwards',
                  animationDelay: '450ms',
                }"
              ></div>
            </td>
          </tr>
          <tr>
            <td colspan="5" class="p-2">
              <div
                class="bg-gray-50 mx-auto animate-pulse rounded-lg w-full h-12"
                :style="{
                  animationFillMode: 'backwards',
                  animationDelay: '600ms',
                }"
              ></div>
            </td>
          </tr>
        </tbody>
        <tbody v-if="parts.length === 0 && !loadingFeature">
          <tr>
            <td colspan="4" class="p-2">
              <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <svg
                      class="h-5 w-5 text-yellow-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm text-yellow-700">
                      No parts were found with your current search.
                      <a
                        href="#"
                        class="font-medium underline text-yellow-700 hover:text-yellow-600"
                        @click="$refs['filter-bar'].clearFilters()"
                      >
                        Try clearing all filters and try again.
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <WFeedbackModal ref="renewalModal" class="z-20 mt-12">
        <div class="w-96">
          <div>
            <div class="text-base text-primary-900 leading-7 font-bold">
              The renewal checklist includes all alternatives you've pursued and
              documents you've submitted for your previous WELL Health-Safety
              rating. You can review the documents and make necessary updates
              for your renewal
            </div>
            <div class="flex p-4 justify-center">
              <WButtonsBase
                type="primaryInverted"
                class="mr-4"
                @click.native="$refs.renewalModal.isHidden = true"
                >Close</WButtonsBase
              >
            </div>
          </div>
        </div>
      </WFeedbackModal>
    </div>
    <div v-else>
      <div class="mx-auto text-center">
        <WLoadingSpinner class="mx-auto" />
        <div class="mt-3 text-primary-600">{{ loadingStatus }}</div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters, mapActions } from 'vuex'
export default {
  layout: 'scorecard',
  props: {
    id: {
      type: Number,
      required: true,
    },
    module: {
      type: Object,
      required: true,
    },
    moduleType: {
      type: String,
      default: 'project',
    },
  },
  data() {
    return {
      loadingStatus: 'Loading Scorecard Data...',
      doneLoading: false,
      partsList: [],
      loadingFeature: false,
      reportDownloadLink: null,
    }
  },
  computed: {
    ...mapState({
      checklist: (state) => state.checklist.scorecard,
      scorecardVersion: (state) => state.checklist.scorecardVersion,
      concepts: (state) => state.checklist.concepts,
      parts: (state) => state.checklist.filteredParts,
      filters: (state) => state.checklist.activeFilters,
      showBanner: (state) => state.settings.showScorecardBanner,
      conceptSummary: (state) => state.checklist.conceptSummary,
    }),
    ...mapGetters('review', ['pendingReview']),
    preconditionPercentage() {
      const perc = Math.round(
        (this.$store.state.checklist.scoresSummary.response_summary.summary
          .response.yes_pre /
          this.$store.state.checklist.scoresSummary.response_summary.summary
            .pre_part_count) *
          100
      )
      return perc >= 100 ? 'All' : perc + '% of '
    },
    expanded() {
      if (this.$store.state.settings.navExpanded == null) {
        return true
      }

      if (this.$store.state.settings.navExpanded === 'false') {
        return false
      }

      if (this.$store.state.settings.navExpanded === 'true') {
        return true
      }
      return this.$store.state.settings.navExpanded
    },
  },
  async mounted() {
    await this.$store.dispatch('checklist/getScorecard', this.id)

    this.loadingStatus = 'Grabbing Concepts List...'

    await this.$store.dispatch('checklist/getConceptAndFeatures', this.id)

    this.loadingStatus = 'Calculating Initial Scores...'

    await this.$store.dispatch('checklist/getScores')

    this.loadingStatus = 'Pulling Verification Options...'

    await this.$store.dispatch('checklist/getHSRVerifications')

    this.loadingStatus = 'Attaching Features List...'

    this.loadingStatus = 'Initializing List...'

    await this.$store.dispatch('checklist/updatePartsList', true)
    await this.$store.dispatch('checklist/getResponseSummary', this.id)
    await this.$store.dispatch('checklist/getGlossary')

    await this.getReviewNotes()

    // Get Version Name and Review List for HSR Opt
    if (this.moduleType === 'hsrOpt') {
      this.$store.dispatch(
        'checklist/getStandardVersionName',
        this.module.hsr_scorecard_version_id
      )
    } else if (this.moduleType === 'wpr') {
      // Get Version Name and Review List for WPR
      this.$store.dispatch(
        'checklist/getStandardVersionName',
        this.module.wpr_scorecard_version_id
      )
    } else if (this.moduleType === 'hsr') {
      // Get Version Name and Review List for HSR
      this.$store.dispatch(
        'checklist/getStandardVersionName',
        this.$store.state.shared.sharedWorkspace.applicable_version_id
      )
      this.$store.dispatch(
        'review/getSharedReviewList',
        this.$store.state.shared.sharedWorkspace.id
      )
    } else {
      this.$store.dispatch(
        'checklist/getStandardVersionName',
        this.module.hsr_scorecard_version_id
      )
    }

    const target = {
      response: [],
      name: '',
      point_weight: null,
      show_preconditions: true,
      show_optimizations: true,
      doc_count: null,
      note_count: null,
      concept: 'All',
      isHSR: true,
      verification: '',
    }

    await this.$store.dispatch('checklist/updateFilters', target)

    this.doneLoading = true
    if (localStorage.getItem('renewalChecklistModal')) {
      setTimeout(() => {
        this.$refs.renewalModal.isHidden = false
        localStorage.removeItem('renewalChecklistModal')
      }, 3000)
    }
  },
  methods: {
    ...mapActions('checklist', ['getReviewResponses']),
    getReviewNotes() {
      this.getReviewResponses({
        module: this.moduleType === 'project' ? 'project' : 'portfolio',
        module_id: this.module.id,
      })
    },
    async downloadReport(payload) {
      this.$refs.reportModal.isHidden = false
      await this.$store
        .dispatch('checklist/downloadScorecardReport', payload)
        .then((result) => {
          window.open(result.data.url, '_blank')
          this.reportDownloadLink = result.data.url
        })
    },

    getConceptId(conceptName) {
      return this.concepts.filter((concept) => concept.name === conceptName)[0]
        .id
    },
  },
}
</script>
