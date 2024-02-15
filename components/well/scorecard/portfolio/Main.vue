<template>
  <div>
    <div v-if="doneLoading">
      <div
        :class="[
          expanded ? 'ml-64  pr-64' : 'ml-16  pr-16',
          'shadow bg-white fixed z-10 left-0 mt-16 top-0 w-full py-4 ',
        ]"
      >
        <PortfolioScorecardFilterBar ref="filter-bar" :module="module" />
      </div>
      <div
        v-if="!$store.state.portfolio.analyzeMode && moduleType === 'portfolio'"
        class="flex items-center justify-between"
      >
        <div class="flex space-x-2">
          <h3
            class="font-semibold text-primary-900"
            :class="
              $store.state.portfolio.analyzeMode ? 'text-2xl' : 'text-1xl'
            "
          >
            {{ $store.state.portfolio.analyzeMode ? 'Analyze' : 'Manage' }}
          </h3>

          <!-- v-if="portfolio.show_dashboard" -->
          <Flyout ref="conceptFlyout" y="bottom" x="right" class="h-full">
            <Toggle
              :value="$store.state.portfolio.analyzeMode"
              @click.native="$store.commit('portfolio/setAnalyzeMode')"
            />
            <template #content>
              <div class="p-3 w-56 text-primary-900 text-sm">
                Enable/Disable Analyze view
              </div>
            </template>
          </Flyout>
        </div>
      </div>
      <PortfolioScorecardHeader :type="scorecard.type" />
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
      <PortfolioScorecardBanner
        v-if="showBanner !== 'false'"
        class="mt-2"
        :concept="filters.concept"
      />
      <PortfolioScorecardStatCards
        v-if="filters.concept !== 'All'"
        :concept="filters.concept"
      />
      <WFeedbackModal ref="precertModal" :can-manually-close="false">
        <div class="mx-auto text-left max-w-3xl">
          <div class="mt-3">
            <WHeadingsHThree
              class="text-primary-600"
              heading="WELL Precertification"
            />
            <p>
              Wonderful! You’ve opted-in to pursue a WELL Precertification for
              your project. Simply upload documentation for at least 50
              points<sup>*</sup> of optimizations, submit for review and pay the
              Precertification invoice to earn your designation. Follow the
              guidance under the Verification section for more details about
              documentation requirements
            </p>
            <p>
              <sup>*</sup>Core projects need to submit at least 40 points of
              optimizations to earn a Precertification designation.
            </p>
          </div>

          <div class="w-32 mx-auto mt-3">
            <WButtonsBase @click.native="closePrecertModal">Close</WButtonsBase>
          </div>
        </div>
      </WFeedbackModal>
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

      <WSlideoversOverlay
        ref="slideover"
        title="Scorecard Summary"
        class="z-40"
      >
        <template #content>
          <div class="px-6 mt-4">
            <WHeadingsHFour class="w-2/3" heading="Targeted Points" />
            <div class="text-sm text-gray-400 -mt-2">
              {{ preconditionPercentage }}
              preconditions +
              {{ totalPoints }} points
              <span v-if="guidancePoints">
                &nbsp;+&nbsp; {{ guidancePoints }} WELL Core points</span
              >
            </div>
            <PortfolioScorecardAnticipatedScoreIndicator
              :total-perc="totalPoints >= 100 ? 100 : totalPoints"
            />

            <div class="grid grid-cols-2 gap-x-6 gap-y-2 mt-5">
              <div class="flex">
                <div v-if="level">
                  <img
                    class="w-16 rounded-lg mt-4"
                    :src="`/scorecard/badges/` + level.toLowerCase() + `.png`"
                  />
                </div>
                <div class="my-auto">
                  <WHeadingsHFour heading="Projected Milestones" class="mt-2" />
                  <div class="text-sm text-gray-400 -mt-2">
                    WELL Certification -
                    <span v-if="level">{{ level }} Level</span>
                  </div>
                </div>
              </div>
            </div>
            <div
              v-if="preconditionPercentage !== 'All'"
              class="mt-2 text-secondary-700"
            >
              *All preconditions must be achieved to earn this projected
              milestone.
            </div>
            <WHeadingsHFour class="w-2/3 mt-4" heading="Totals by concept" />
            <div class="text-sm text-gray-400 -mt-2">By response</div>
            <div class="grid grid-cols-2 gap-x-6 gap-y-2 mt-5">
              <div
                v-for="(concept, name) in scorecard.assessment_score
                  .conceptScore"
                :key="name"
              >
                <div class="font-bold -mb-1 uppercase">
                  {{ concept.concept_name }}
                </div>
                <div class="flex justify-between text-sm text-gray-400">
                  <div>
                    {{ getConceptPoints(concept) }}

                    <span v-if="concept.guidance_points > 0">
                      +
                      {{ concept.guidance_points }} CORE PTS
                    </span>
                    <span v-else> PTS </span>
                  </div>
                  <div>
                    <span
                      v-if="
                        Math.round(
                          (parseFloat(
                            getConceptPoints(concept) + concept.guidance_points
                          ) /
                            getTotalConceptPoints(concept)) *
                            100
                        ) < 100
                      "
                    >
                      {{
                        Math.round(
                          (parseFloat(
                            getConceptPoints(concept) + concept.guidance_points
                          ) /
                            getTotalConceptPoints(concept)) *
                            100
                        )
                      }}%
                    </span>
                    <span v-else> 100% </span>
                  </div>
                </div>
                <PortfolioScorecardHorizontalIndicator
                  :concept-name="concept.concept_name"
                  class="mt-2"
                  :yes="
                    parseFloat(
                      getConceptPoints(concept) + concept.guidance_points
                    )
                  "
                  :total="getTotalConceptPoints(concept)"
                />
              </div>
            </div>
            <div
              v-if="totalPoints > 111"
              class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-5"
            >
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
                  <div class="text-sm text-yellow-700">
                    <p>
                      You are targeting more than the maximum 110 points allowed
                      per submission. Please review the YES status in your
                      scorecard to adjust your selections to lower the total
                      number of points pursuing.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="finalDocSubDate">
              <WHeadingsHFour class="w-2/3 mt-6" heading="Estimated timeline" />
              <div class="text-sm text-gray-400 -mt-2">By review dates</div>
              <div class="flex space-x-2 items-center">
                <span v-if="!editDate" class="text-secondary-800 text-2xl">
                  {{ $dayjs(finalDocSubDate).format('MMM DD, YYYY') }}*
                </span>
                <FormulateInput
                  v-else
                  v-model="newDate"
                  type="datetimepicker"
                  label="Please update estimated date of document submission"
                  max="9999-01-01"
                />
                <div v-if="allowDateEdit" class="w-32">
                  <WLinksBase v-if="!editDate" @click.native="changeDate()"
                    >Edit</WLinksBase
                  >
                  <WButtonsBase v-else class="mt-3" @click.native="changeDate()"
                    >Save</WButtonsBase
                  >
                </div>
              </div>
            </div>
          </div>
        </template>
      </WSlideoversOverlay>

      <table class="mt-3 w-full mx-auto shadow divide-y rounded-t-lg">
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
              Strategy
            </th>
            <th
              class="w-3/12 px-6 py-3 bg-primary-700 text-left text-xs leading-4 font-medium text-white uppercase tracking-wider"
            >
              Weight
            </th>
            <th
              class="rounded-tr-lg px-6 py-3 bg-primary-700 text-left text-xs leading-4 font-medium text-white uppercase tracking-wider"
            >
              Pursuing
            </th>
          </tr>
        </thead>
        <tbody
          v-if="!loadingFeature"
          :class="[module.type === 'v2-pilot' && 'divide-y']"
        >
          <tr v-for="feature in features" :key="feature.id">
            <td
              v-if="module.type === 'v2-pilot'"
              class="w-12 bg-primary-600 text-white text-xs text-center relative py-4 px-3 text-center"
            >
              <div class="w-6">
                <div
                  class="transform -rotate-90 whitespace-nowrap absolute -right-1"
                  style="top: 40%"
                >
                  {{
                    feature.max_points ? `Max ${feature.max_points} pts` : ''
                  }}
                </div>
              </div>
            </td>
            <td colspan="4">
              <LazyPortfolioScorecardTableRow
                v-for="(part, index) in feature.parts"
                :id="'scorecard-part-' + part.id"
                ref="table-row"
                :key="part.concept_name + '-' + index"
                :module="module"
                :module-type="moduleType"
                :part="part"
                :feature="feature"
                :active-concept="part.concept_name"
              />
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td colspan="4" class="p-2">
              <div
                class="bg-gray-400 mx-auto animate-pulse rounded w-full h-12"
              ></div>
            </td>
          </tr>
          <tr>
            <td colspan="4" class="p-2">
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
            <td colspan="4" class="p-2">
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
            <td colspan="4" class="p-2">
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
            <td colspan="4" class="p-2">
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
      required: true,
    },
  },
  data() {
    return {
      finalDocSubDate: null,
      loadingStatus: 'Loading Scorecard Data...',
      doneLoading: false,
      partsList: [],
      loadingFeature: false,
      reportDownloadLink: null,
      editDate: false,
      newDate: null,
    }
  },
  computed: {
    ...mapState({
      scorecard: (state) => state.scorecard.scorecard,
      concepts: (state) => state.scorecard.concepts,
      parts: (state) => state.scorecard.filteredParts,
      features: (state) => state.scorecard.filteredFeatures,
      filters: (state) => state.scorecard.activeFilters,
      showBanner: (state) => state.settings.showScorecardBanner,
      conceptSummary: (state) => state.scorecard.conceptSummary,
      guidanceScores: (state) =>
        state.scorecard.scorecard.assessment_score.guidanceScore,
      assessmentScore: (state) => state.scorecard.scorecard.assessment_score,
      currentUser: (state) => state.user.currentUser,
    }),
    allowDateEdit() {
      if (this.finalDocSubDate !== null) {
        if (
          (this.$dayjs().isAfter(this.finalDocSubDate, 'day') &&
            this.module.user_id === this.currentUser.id) ||
          this.currentUser.role.includes('well-admin')
        ) {
          return true
        }
      }
      return false
    },
    ...mapGetters('review', ['pendingReview']),
    guidancePoints() {
      let guidancePoints = 0
      if (
        this.scorecard &&
        this.scorecard.assessment_score &&
        this.scorecard.assessment_score.guidance_points
      ) {
        guidancePoints = parseFloat(
          this.scorecard.assessment_score.guidance_points
        )

        return guidancePoints
      }
      return 0
    },
    conceptGuidancePoints() {
      let points = 0
      if (this.assessmentScore && this.assessmentScore.conceptScore) {
        const concept = this.assessmentScore.conceptScore
        const guidanceScore = concept.find(
          (a) => a.concept_name === this.concept
        )
        if (guidanceScore) {
          points = parseFloat(guidanceScore.guidance_points)
        }
      }
      return points
    },
    totalPoints() {
      let totalPoints = 0
      if (this.scorecard && this.scorecard.assessment_score) {
        totalPoints = parseFloat(this.scorecard.assessment_score.score)
        if (
          this.scorecard.assessment_score.innovationScore &&
          this.scorecard.assessment_score.innovationScore.points
        ) {
          totalPoints =
            totalPoints +
            parseFloat(this.scorecard.assessment_score.innovationScore.points)
        }

        return totalPoints
      }
      return 0
    },
    level() {
      const points = this.totalPoints + this.guidancePoints
      if (points >= 40 && points < 50) {
        return 'Bronze'
      } else if (points >= 50 && points < 60) {
        return 'Silver'
      } else if (points >= 60 && points < 80) {
        return 'Gold'
      } else if (points >= 80) {
        return 'Platinum'
      }
      return false
    },
    preconditionPercentage() {
      const perc = Math.round(
        (this.$store.state.scorecard.scoresSummary.response_summary.summary
          .response.yes_pre /
          this.$store.state.scorecard.scoresSummary.response_summary.summary
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
  watch: {
    // watch the filter changes and cache a concept load on first request
    filters: {
      async handler(val) {
        if (
          this.filters.concept !== 'All' &&
          !this.concepts.filter((concept) => concept.name === val.concept)[0]
            .features
        ) {
          this.loadingFeature = true
          await this.$store.dispatch(
            'scorecard/getFeatures',
            this.getConceptId(val.concept)
          )
          this.$store.dispatch('scorecard/updatePartsList')
          this.loadingFeature = false
        }
      },
      deep: true,
    },
  },
  async mounted() {
    await this.$store.dispatch('scorecard/getScorecard', this.id)

    this.loadingStatus = 'Grabbing Concepts List...'

    await this.$store.dispatch(
      'scorecard/getConcepts',
      this.scorecard.version_id
    )

    this.loadingStatus = 'Pulling Verification Options...'

    await this.$store.dispatch('scorecard/getVerifications')

    this.loadingStatus = 'Calculating Initial Scores...'

    await this.$store.dispatch('scorecard/getScores')

    this.loadingStatus = 'Attaching Features List...'

    await this.$store.dispatch('scorecard/getAllFeatures')

    this.loadingStatus = 'Initializing List...'

    await this.$store.dispatch('scorecard/updatePartsList')
    await this.$store.dispatch('scorecard/getResponseSummary')
    await this.getReviewNotes()

    if (this.moduleType === 'hsr' || this.moduleType === 'portfolio')
      this.$store.dispatch('review/getSharedReviewList', this.module.id)

    if (this.$route.query.filters) {
      const target = {
        concept: 'All',
        response: [],
        name: '',
        point_weight: null,
        show_preconditions: true,
        show_optimizations: true,
        doc_count: null,
        note_count: null,
      }

      const returnedTarget = Object.assign(
        target,
        JSON.parse(this.$route.query.filters)
      )

      await this.$store.dispatch('scorecard/updateFilters', returnedTarget)
    }

    if (
      this.scorecard.type === 'v2-pilot' &&
      this.scorecard.version_id !== 121
    ) {
      this.$axios.get(`api/verifications`).then((res) => {
        this.$store.commit('scorecard/setVerifications', res.data)
      })
    }

    this.doneLoading = true

    if (this.module.doc_sub_date_est) {
      this.$store
        .dispatch('scorecard/getTimeline', {
          appSubmissionDate: this.module.doc_sub_date_est,
        })
        .then((res) => {
          if (res.finalDocSubDate) {
            this.finalDocSubDate = res.finalDocSubDate
          }
        })
    }

    this.$nextTick(() => {
      const self = this
      if (localStorage.getItem('showPrecertModal')) {
        self.$refs.precertModal.isHidden = false
      }
    })
  },
  async beforeDestroy() {
    await this.$store.commit('scorecard/setScorecard', null)
  },
  methods: {
    ...mapActions('scorecard', ['getReviewResponses']),
    getTotalConceptPoints(concept) {
      return concept.concept_name === 'Innovations' ||
        concept.concept_name === 'Innovation'
        ? 10
        : 12
    },
    analyzeScreen() {
      this.$store.commit('portfolio/setAnalyzeMode')
      this.$store.commit(
        'settings/setNavState',
        !this.$store.state.settings.navExpanded
      )
    },
    closePrecertModal() {
      this.$refs.precertModal.isHidden = true
      localStorage.removeItem('showPrecertModal')
    },
    changeDate() {
      // const self = this
      if (this.newDate && this.editDate) {
        // format data
        const formData = JSON.parse(JSON.stringify(this.module))
        formData.space_types = formData.space_types.map((el) => el.id)
        formData.doc_sub_date_est = this.newDate

        // call the api
        this.$store
          .dispatch('project/updateProjectInfo', formData)
          .then((res) => {
            this.$store.dispatch('notifications/toastMessage', {
              message: 'New date saved!',
            })
            this.$store
              .dispatch('scorecard/getTimeline', {
                appSubmissionDate: this.newDate,
              })
              .then((res) => {
                if (res.finalDocSubDate) {
                  this.finalDocSubDate = res.finalDocSubDate
                }
              })
          })
      }
      this.editDate = !this.editDate
    },
    getConceptGuidancePoints(concept) {
      let points = 0
      if (
        this.scorecard &&
        this.scorecard.assessment_score &&
        this.scorecard.assessment_score.guidanceScore
      ) {
        const guidance = this.scorecard.assessment_score.guidanceScore
        const conceptGuidance = guidance.find(
          (a) => a.concept_name === concept.concept_name
        )
        if (conceptGuidance) {
          points = parseFloat(conceptGuidance.guidance_points)
        }
      }
      return points
    },
    getConceptPoints(concept) {
      let points = concept.points
      points = points + this.getConceptGuidancePoints(concept)

      return points
    },
    getReviewNotes() {
      this.getReviewResponses({
        module: this.moduleType,
        module_id: this.module.id,
      })
    },
    async downloadReport(payload) {
      this.$refs.reportModal.isHidden = false
      if (this.module.type === 'v2') {
        await this.$store
          .dispatch('scorecard/downloadReport', payload)
          .then((result) => {
            window.open(result.data.url, '_blank')
            this.reportDownloadLink = result.data.url
          })
      } else {
        await this.$store
          .dispatch('scorecard/downloadScorecardReport')
          .then((result) => {
            window.open(result.data.url, '_blank')
            this.reportDownloadLink = result.data.url
          })
      }
    },

    getConceptId(conceptName) {
      const id = this.concepts.filter(
        (concept) => concept.name === conceptName
      )[0].id
      return id
    },
  },
}
</script>
