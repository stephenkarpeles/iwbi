<template>
  <div>
    <div class="mb-5">
      <div class="flex">
        <WHeadingsHTwo class="text-primary-900" heading="Reviews" />
      </div>
    </div>
    <div v-if="showreviewdetails && portfolioInfo">
      <div class="md:w-80 mb-5">
        <WButtonsBase
          v-if="!pendingReview"
          icon="plus"
          @click.native="$refs.modal.isHidden = false"
        >
          Submit Review
        </WButtonsBase>
      </div>
      <div
        v-if="allReviews.length"
        class="rounded-md bg-primary-50 mb-5 p-4 rounded-lg border border-primary-300 text-primary-700 text-sm"
      >
        <div>
          Note: Our team will evaluate the documents submitted in this review
          cycle and will contact you via email if any additional documents are
          required for audited features. Once you have confirmed the review file
          is complete, the review cycle will officially begin.
          <br />
          <br />
          After a review cycle begins, the WELL Reviewer will respond with
          comments within 20–25 business days indicating whether documentation
          and/or testing results submitted for each feature are satisfactory.
          The WELL Portfolio team will have an opportunity to amend existing
          documents or submit additional materials for a second-round review.
          The WELL Reviewer will respond with the results of the second-round
          review by issuing the WELL Report within 20–25 business days. These
          two review rounds are included within one complete review cycle.
        </div>
      </div>
      <div class="md:flex">
        <div
          class="flex flex-col"
          :class="
            allReviews.length ? 'w-full' : 'space-y-6 md:w-2/3 mr-0 md:mr-6'
          "
        >
          <div
            class="shadow overflow-auto border-b border-gray-200 sm:rounded-lg mt-1 mb-5 md:mb-0"
          >
            <table
              v-if="allReviews && allReviews.length"
              class="table-auto w-full divide-y divide-gray-200"
            >
              <thead>
                <tr
                  class="text-xs uppercase bg-primary-700 text-white px-3 whitespace-nowrap"
                >
                  <th class="text-left p-4">Review Phase</th>
                  <th class="p-4">Submitted on</th>
                  <th class="p-4">Status</th>
                  <th class="p-4">Est. Review Date</th>
                  <th class="p-4">Reviewed on</th>
                  <th class="p-4">Actions</th>
                </tr>
              </thead>

              <tbody
                class="text-left text-primary-900 divide-y divide-gray-200"
              >
                <tr v-for="(reviewList, index) in allReviews" :key="index">
                  <td class="p-2 md:p-4 text-sm">
                    <div class="leading-5">
                      {{ reviewList.phase }}
                    </div>
                    <div
                      v-if="reviewList.is_hsr"
                      class="text-xs leading-5 md:px-2 px-3 inline-flex rounded-full bg-primary-600 text-white"
                    >
                      WELL Health-safety
                    </div>
                    <div
                      v-if="reviewList.type === 'v2-hsr'"
                      class="text-xs leading-5 px-2 inline-flex rounded-full bg-primary-600 text-white ml-2"
                    >
                      WELL Health-safety Only
                    </div>
                  </td>
                  <td class="p-4 text-sm text-center whitespace-nowrap">
                    {{
                      reviewList.created_at
                        ? $dayjs(reviewList.created_at).format('MMM DD, YYYY')
                        : '-'
                    }}
                  </td>
                  <td class="text-center whitespace-nowrap">
                    <span
                      v-if="reviewList.status === 'pre-reviewed'"
                      class="text-center badge-info uppercase p-1 bg-green-500 text-white rounded-full px-2 text-xs font-semibold"
                      style="font-size: 10px"
                    >
                      Preliminary Review Completed
                    </span>
                    <span
                      v-if="reviewList.status === 'reviewed'"
                      class="text-center badge-info uppercase p-1 bg-green-500 text-white rounded-full px-2 text-xs font-semibold"
                      style="font-size: 10px"
                    >
                      Completed
                    </span>
                    <span
                      v-if="reviewList.status === 'pending'"
                      class="text-center badge-info uppercase p-1 bg-yellow-400 text-white rounded-full px-2 text-xs font-semibold"
                      style="font-size: 10px"
                    >
                      {{
                        reviewList.pre_status
                          ? 'Final Review In Progress'
                          : 'Preliminary Review In Progress'
                      }}
                    </span>
                    <span
                      v-if="reviewList.status === 'mid-review'"
                      class="text-center badge-info uppercase p-1 bg-primary-500 text-white rounded-full px-2 text-xs font-semibold"
                      style="font-size: 10px"
                    >
                      require clarification
                    </span>
                    <span
                      v-if="reviewList.status === 'payment-pending'"
                      class="text-center badge-info uppercase p-1 bg-red-600 text-white rounded-full px-2 text-xs font-semibold"
                      style="font-size: 10px"
                    >
                      payment pending
                    </span>
                  </td>
                  <td class="p-4 text-sm text-center whitespace-nowrap">
                    {{
                      reviewList.est_date
                        ? $dayjs(reviewList.est_date).format('MMM DD, YYYY')
                        : '-'
                    }}
                  </td>
                  <td class="p-4 text-sm text-center">
                    {{
                      reviewList.review_date
                        ? $dayjs(reviewList.review_date).format('MMM DD, YYYY')
                        : '-'
                    }}
                  </td>
                  <td class="p-4 text-center">
                    <div class="w-20 mx-auto">
                      <WButtonsBase
                        type="primaryInverted"
                        icon="eye"
                        @click.native="
                          $router.push(
                            `/portfolio/${portfolioInfo.portfolio_number}/reviews/${reviewList.id}`
                          )
                        "
                      />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <AlertCard v-else class="mt-5 m-4">
              The team has not submitted for any portfolio reviews yet.
            </AlertCard>
          </div>
        </div>

        <div v-if="!allReviews.length" class="md:w-1/3">
          <div>
            <div class="border border-primary-300 rounded-md mb-5">
              <div class="relative flex justify-between">
                <div class="p-5">
                  <div
                    class="text-xs tracking-tighter font-semibold text-primary-600 leading-5 uppercase"
                  >
                    Portfolio
                  </div>
                  <div
                    class="text-lg font-bold text-primary-900 whitespace-nowrap"
                  >
                    WELL Portfolio Score
                  </div>
                  <span></span>
                  <div class="w-40 my-2">
                    <Flyout y="bottom" x="left" class="h-full">
                      <WButtonsBase type="primaryInverted"
                        >Learn More</WButtonsBase
                      >
                      <template #content>
                        <div class="md:w-96 p-4">
                          <h3 class="text-xl text-primary-700 mb-2">
                            WELL Portfolio Score
                          </h3>
                          <div class="">
                            <div class="leading-tight text-sm text-gray-700">
                              <span
                                >The WELL Portfolio Score is the weighted
                                average of the points achieved across all
                                projects within the portfolio. Scores are
                                weighted by the actual or expected number of
                                occupants within the project.
                              </span>
                              <span class="mt-4"
                                >While WELL v2 preconditions are not allocated
                                points, projects that have not met all
                                preconditions contribute a maximum of 49 points
                                toward the WELL Portfolio Score, even if they
                                have achieved more than 49 points through
                                optimizations.</span
                              >
                            </div>
                          </div>
                        </div>
                      </template>
                    </Flyout>
                  </div>
                </div>
                <div class="self-end">
                  <img
                    src="/portfolio/screen/review/portfolio-review.png"
                    alt=""
                    srcset=""
                  />
                </div>
              </div>
            </div>
          </div>
          <div
            class="w-full border border-primary-300 bg-primary-50 rounded-md p-5 flex flex-col"
          >
            <div
              class="text-xs tracking-tighter font-semibold text-primary-600 leading-5 uppercase"
            >
              About
            </div>
            <div class="text-lg font-bold text-primary-900 whitespace-nowrap">
              Review Cycle
            </div>
            <div class="py-3">
              <hr />
            </div>
            <div
              class="text-base text-primary-900 tracking-tighter leading-6 mb-3"
            >
              <p>
                Portfolios can submit documents and testing results for review
                twice per year, providing multiple opportunities to improve your
                WELL Portfolio Score over time.
              </p>
            </div>
            <div
              class="text-base text-primary-900 tracking-tighter leading-6 mb-3 opacity-50"
            >
              <p>
                After a review cycle begins, the WELL Reviewer will respond with
                comments within 20–25 business days indicating whether
                documentation and/or testing results submitted for each feature
                are satisfactory. The WELL Portfolio team will have an
                opportunity to amend existing documents or submit additional
                materials for a second-round review. The WELL Reviewer will
                respond with the results of the second-round review by issuing
                the WELL Report within 20–25 business days. These two review
                rounds are included within one complete review cycle.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <WLinksBase
        class="text-primary-500 mt-3"
        icon="arrow-narrow-left"
        icon-position="left"
        type="primary"
        @click.native="backtolist()"
      >
        Back to all reviews
      </WLinksBase>
      <template v-if="selectedReviewId">
        <PortfolioReviewDetailsScreen
          v-if="
            allReviews.find((a) => a.id === selectedReviewId).type !== 'v2-hsr'
          "
          :id="selectedReviewId"
          :all-reviews="allReviews"
        />
        <PortfolioReviewHSRDetailsScreen
          v-else
          :id="selectedReviewId"
          :all-reviews="allReviews"
        />
      </template>
    </div>
    <WFeedbackModal ref="modal">
      <PortfolioReviewSubmitScreen v-if="portfolioInfo" />
    </WFeedbackModal>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      showreviewdetails: true,
      selectedReviewId: '',
      review: '',
    }
  },
  computed: {
    ...mapState({
      portfolioInfo: (state) => state.portfolio.portfolio,
      allReviews: (state) => state.review.allReviews,
    }),
    pendingReview() {
      if (
        this.allReviews &&
        this.allReviews.length > 0 &&
        this.allReviews.filter((review) => review.status !== 'reviewed')
          .length > 0
      ) {
        return true
      }
      return false
    },
    calcProjectId() {
      const id = this.$route.params.id.toString().substring(5, 10)
      return parseInt(id)
    },
  },
  mounted() {
    this.$store.dispatch(
      'review/getSharedReviewList',
      this.$route.params.id.toString().substring(5, 10)
    )
  },
  methods: {
    getList() {
      this.$store.dispatch(
        'review/getSharedReviewList',
        this.$route.params.id.toString().substring(5, 10)
      )
    },
    viewDetails(id, index) {
      this.showreviewdetails = false
      this.selectedReviewId = id
    },
    async backtolist() {
      await this.$store.dispatch(
        'review/getSharedReviewList',
        this.portfolioInfo.id
      )
      this.showreviewdetails = true
    },
  },
}
</script>
