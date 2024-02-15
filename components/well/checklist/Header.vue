<template>
  <div class="pb-8">
    <WLinksBase
      v-if="
        $route.fullPath ===
        `/projects/${module.type}/${module.project_number}/hsr-checklist`
      "
      type="navPrimary"
      :link="`/projects/${module.type}/${module.project_number}/dashboard`"
      icon="arrow-narrow-left"
      class="mb-5 text-sm font-bold"
    >
      Back to Dashboard
    </WLinksBase>
    <WStepsHorizontal
      alignment="justify-around"
      :steps="[
        {
          name: 'SELECT 15 FEATURES',
          status: getStatStatus,
          caption: yesCount + '/15 selected',
        },
        {
          name: recertificationList.length
            ? 'UPDATE/UPLOAD DOCUMENTS'
            : 'UPLOAD DOCUMENTS',
          status: getDocumentCounts,
          caption: totalDocumentCounts + '/15 uploaded',
        },
        {
          name: 'SUBMIT FOR REVIEW',
          status: getReviewStatus,
        },
      ]"
      @stepsUpdated="changeSteps"
    />

    <div class="grid grid-cols-3 mt-5">
      <div class="col-span-2">
        <div v-if="!recertificationList.length">
          <div v-if="module.hsr_achieved_date">
            <WHeadingsHThree
              class="mt-auto text-primary-800"
              heading="Checklist"
            />
            <p class="text-sm text-gray-600 max-w-xl">
              This checklist below shows the features achieved by the project
              based on year of achievement.
            </p>
          </div>
          <div v-else>
            <div v-if="getDocumentCounts === ''">
              <WHeadingsHThree
                class="mt-auto text-primary-800"
                heading="Customize your checklist"
              />
              <p class="text-sm text-gray-600 max-w-xl">
                To earn your rating, each location must achieve at least 15 of
                the WELL features listed below. First, select which you’d like
                to pursue. Additional program rules available in the

                <a
                  v-show="
                    !recertificationList.length ||
                    (recertificationList.length && recertificationChecklist)
                  "
                  class="text-primary-600 inline"
                  href="https://resources.wellcertified.com/tools/well-ratings-guidebook/"
                  target="_blank"
                >
                  WELL
                  {{ moduleName }}
                  Rating Guidebook
                </a>
              </p>
            </div>
            <div v-else>
              <WHeadingsHThree
                class="mt-auto text-primary-800"
                heading="Upload documents for your selected features"
              />
              <p>
                You've selected the Features you'd like to pursue. Now start
                uploading the required documents indicated under the “Verified
                by” section for each Feature.
                <span v-if="moduleType !== 'wpr' && moduleType !== 'hsrOpt'"
                  >Also don't forget to check the

                  <router-link
                    class="text-primary-700"
                    :to="`/projects/${module.type}/${module.project_number}/locations`"
                  >
                    Locations</router-link
                  >
                  tab on the left sidebar and provide location specific
                  information.</span
                >
              </p>
              <p>
                Tools and guidance can be found in the Resources section of your
                checklist below, as well as the
                <a
                  class="text-primary-700"
                  target="_blank"
                  href="https://well.support/checklist-guide~fd23fc7f-d6da-478d-90db-f9a93eadfd40"
                >
                  knowledge base.
                </a>
              </p>
            </div>
          </div>
          <!-- Version  doc link-->
          <div
            v-if="scorecard && scorecard.type == 'wpr'"
            class="text-sm flex mt-1"
          >
            <span class="font-semibold text-sm">Applicable version:</span>
            <WLinksBase
              class="ml-2"
              target="_blank"
              :link="
                scorecardVersion !== undefined
                  ? `https://v2.wellcertified.com/${scorecardVersion.version}/en/performance-rating-sl/overview`
                  : `https://v2.wellcertified.com/en/performance-rating-sl/overview`
              "
            >
              {{ scorecardVersion && scorecardVersion.name }}
            </WLinksBase>
          </div>
          <div v-else-if="scorecardVersion" class="text-sm flex mt-1">
            <span class="font-semibold text-sm">Applicable version:</span>
            <WLinksBase
              class="ml-2"
              target="_blank"
              :link="`https://v2.wellcertified.com/${scorecardVersion.version}/en/overview`"
            >
              {{ scorecardVersion && scorecardVersion.name }}
            </WLinksBase>
          </div>
        </div>
        <div v-else>
          <div v-if="!isActiveChecklist">
            <WHeadingsHThree
              class="mt-auto text-primary-800"
              heading="Checklist"
            />
            <p class="text-sm text-gray-600 max-w-xl">
              This checklist below shows the features achieved by the project
              based on year of achievement.
            </p>
          </div>
          <div v-else>
            <WHeadingsHThree
              class="mt-auto text-primary-800"
              heading="Customize your checklist"
            />
            <p>
              To renew your rating, each location must maintain achievement of
              at least 15 of the WELL features listed below. First, confirm your
              checklist. Additional renewal rules available in the
              <a
                v-show="
                  !recertificationList.length ||
                  (recertificationList.length && recertificationChecklist)
                "
                class="text-primary-600 inline"
                href="https://a.storyblok.com/f/52232/x/0da851f648/well-health-safety-rating-guidebook-0630.pdf"
                target="_blank"
              >
                WELL Health-Safety Rating Guidebook
              </a>
            </p>

            <Flyout
              v-if="recertificationList.length > 0 && isActiveChecklist"
              ref="popModal"
              x="right"
            >
              <div class="text-sm flex mt-2">
                <span class="font-semibold text-sm">Checklist version:</span>
                <WLinksBase
                  class="ml-2"
                  target="_blank"
                  :link="`https://v2.wellcertified.com/${scorecardVersion.version}/en/overview`"
                >
                  {{ scorecardsOptions }}
                </WLinksBase>
              </div>
              <template #content>
                <div class="text-primary-700 p-4 text-sm leading-2">
                  The renewal checklist includes all strategies you've pursued
                  and documents you've submitted for your previous WELL
                  Health-Safety rating. You can review the documents and make
                  necessary updates for your renewal
                </div>
              </template>
            </Flyout>
            <div v-if="!isActiveChecklist" class="text-sm flex mt-2">
              <span class="font-semibold text-sm">Checklist version:</span>
              <WLinksBase
                class="ml-2"
                target="_blank"
                :link="`https://v2.wellcertified.com/${scorecardVersion.version}/en/overview`"
              >
                {{ scorecardsOptions }}
              </WLinksBase>
            </div>
            <div v-if="scorecardVersion" class="text-sm flex mt-1">
              <span class="font-semibold text-sm">Applicable version:</span>
              <WLinksBase
                class="ml-2"
                target="_blank"
                :link="`https://v2.wellcertified.com/${scorecardVersion.version}/en/overview`"
              >
                {{ scorecardVersion.name }}
              </WLinksBase>
            </div>
          </div>
        </div>
      </div>

      <ChecklistStatCard
        :progress="progress"
        header="Progress"
        :sub-header="15 + ' Required Features'"
        :total-strategies="15"
        :yes="yesCount"
        :maybe="maybeCount"
        :no="noCount"
      />
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  props: {
    type: {
      type: String,
      required: false,
      default: 'TYPE NOT GIVEN',
    },
    checklist: {
      type: Object,
      required: true,
    },
    parts: {
      type: Array,
      required: true,
      default: () => {
        return []
      },
    },
    module: {
      type: Object,
      required: true,
    },
    moduleType: {
      type: String,
      required: true,
      default: 'hsr',
    },
  },
  computed: {
    ...mapState({
      anticipatedScore: (state) => state.checklist.anticipatedScore,
      scoresSummary: (state) => state.checklist.scoresSummary,
      scorecardVersion: (state) => state.checklist.scorecardVersion,
      recertificationList: (state) => state.recertification.recertificationList,
      scorecard: (state) => state.checklist.scorecard,
      isActiveChecklist: (state) => state.checklist.isActiveChecklist,
    }),
    moduleName() {
      // if (this.scorecard) {
      if (this.moduleType === 'wpr' || this.scorecard.type === 'wpr')
        return 'Performance '
      // }
      return 'Health-Safety'
    },
    scorecardsOptions() {
      let options = []
      let renewalChecklist = ''
      if (this.module.all_scorecards) {
        options = [
          ...this.module.all_scorecards.filter((a) => a.type === 'v2-hsr'),
        ]
        renewalChecklist = options.filter((a) => a.id === this.scorecard.id)[0]
          .label
      }
      return renewalChecklist
    },
    scores() {
      if (this.scoresSummary) {
        if (this.scoresSummary.response_summary) {
          return this.scoresSummary.response_summary
        }
        return ''
      }
      return ''
    },
    yesCount() {
      if (this.scores) {
        // Based on new API response for multiple part calculation
        const yes = this.scores.summary.response.yes_opt_feature_completed
          ? parseInt(this.scores.summary.response.yes_opt_feature_completed)
          : 0
        return yes
      } else {
        return 0
      }
    },
    noCount() {
      if (this.scores) {
        const no = this.scores.summary.response.no
          ? parseInt(this.scores.summary.response.no)
          : 0

        return no
      } else {
        return 0
      }
    },
    maybeCount() {
      if (this.scores) {
        const maybe = this.scores.summary.response.maybe
          ? parseInt(this.scores.summary.response.maybe)
          : 0

        return maybe
      } else {
        return 0
      }
    },
    progress() {
      if (this.scores) {
        if (this.yesCount) {
          return this.yesCount > 15 ? 100 : (this.yesCount / 15) * 100
        }
      }
      return 0
    },
    getStatStatus() {
      // See document logic
      if (this.recertificationList.length) return 'complete'
      if (this.parts) {
        // Based on new API response for multiple part calculation
        return parseInt(
          this.scores.summary.response.yes_opt_feature_completed
        ) >= 15
          ? 'complete'
          : 'current'
      } else return 'current'
    },
    totalDocumentCounts() {
      // Based on new API response for multiple part calculation
      return parseInt(this.scores.summary.response.yes_feature_document_count)
    },
    getDocumentCounts() {
      if (this.getStatStatus === 'current') {
        return ''
      } else {
        return this.parts.filter((element) => element.all_document_count >= 1)
          .length >= 15
          ? 'complete'
          : 'current'
      }
    },
    getReviewStatus() {
      if (this.recertificationList.length) {
        if (
          this.$store.state.review.allReviews &&
          this.$store.state.review.allReviews.length &&
          (this.$store.state.review.allReviews.filter((a) =>
            a.phase.includes('Renewal Preliminary Health-Safety Review')
          ).length ||
            this.$store.state.review.allReviews.filter((a) =>
              a.phase.includes('Renewal Final Health-Safety Review')
            ).length)
        ) {
          return 'complete'
        } else if (this.getDocumentCounts === 'complete') {
          return 'current'
        } else {
          return ''
        }
      }
      if (
        this.$store.state.review.allReviews &&
        this.$store.state.review.allReviews.length &&
        (this.$store.state.review.allReviews.filter((a) =>
          a.phase.includes('Preliminary Health-Safety Review')
        ).length ||
          this.$store.state.review.allReviews.filter((a) =>
            a.phase.includes('Final Health-Safety Review')
          ).length)
      ) {
        return 'complete'
      } else if (this.getDocumentCounts === 'complete') {
        return 'current'
      } else {
        return ''
      }
    },
    recertificationChecklist() {
      let recertification = ''
      if (this.recertificationList.length !== 0) {
        const lastrecertification = this.recertificationList.length - 1
        recertification = this.recertificationList[lastrecertification]
      }
      if (recertification.scorecard_id === this.scorecard.id) {
        return true
      }
      return false
    },
  },
  methods: {
    changeSteps(step) {
      if (
        this.getDocumentCounts === 'complete' &&
        step.name === 'SUBMIT FOR REVIEW' &&
        step.status
      ) {
        if (this.moduleType === 'project') {
          this.$router.push(
            '/projects/' +
              this.module.type +
              '/' +
              this.module.project_number +
              '/reviews'
          )
        } else if (this.moduleType === 'portfolio') {
          this.$router.push(
            '/portfolio/' + this.module.portfolio_number + '/reviews'
          )
        } else {
          this.$router.push(
            '/shared-workspaces/' + this.module.portfolio_number + '/reviews'
          )
        }
      }
    },
  },
}
</script>
