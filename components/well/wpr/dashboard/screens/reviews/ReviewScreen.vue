<template>
  <div>
    <div v-if="showreviewdetails" class="mb-5">
      <div class="flex">
        <WHeadingsHTwo :heading="`Reviews - ${project.name}`" />
      </div>
    </div>
    <div v-if="showreviewdetails">
      <div class="w-40 mb-5">
        <WButtonsBase
          v-if="showReviewButton"
          icon="plus"
          @click.native="$refs.modal.isHidden = false"
        >
          Submit Review
        </WButtonsBase>
      </div>
      <AlertCard v-if="showBanner" class="mt-5">
        <span class="flex">
          Renewal fee is required before submitting for review. Please make the
          payment
          <WLinksBase
            :link="`/shared-workspaces/${sharedWorkspace.portfolio_number}/billing`"
            class="underline w-10 text-yellow-700 ml-1"
          >
            here.
          </WLinksBase>
        </span>
      </AlertCard>
      <div
        v-if="showreviewdetails"
        class="rounded-md bg-primary-50 p-4 mb-5 rounded-lg border border-primary-300 text-primary-700"
      >
        <p class="text-sm text-primary-700">
          A hallmark of the WELL Performance Rating is a third-party review
          process to validate the important work your team has done meets the
          requirements of each feature. This is a valuable step that ensures the
          health and performance intent of each strategy has been successfully
          achieved at each location. All review cycle have two rounds, a
          preliminary review and a final review. This enables teams to respond
          to comments, clarify issues or supply any missing information. For all
          projects the review timeline is currently 20-25 business days for each
          review.
        </p>
      </div>
      <div
        v-if="showreviewdetails"
        class="rounded-md bg-primary-50 p-4 mb-5 rounded-lg border border-primary-300 text-primary-700"
      >
        <WHeadingsHFour heading="Minimum requirements" />
        <p class="mg-b-5 text-sm text-primary-700">
          Your submission will need to contain the following items in order for
          WELL Reviewers to commence a review:
        </p>
        <ul class="list-disc ml-5 md:ml-8 mb-5 text-sm text-primary-700">
          <li>
            A completed checklist with a minimum of 21 features marked as YES to
            indicate you are pursuing, with the associated verification
            documents uploaded to each feature. There should be no MAYBE
            responses remaining on your checklist.
          </li>
          <li>
            For submissions utilizing the multiple projects pathway:
            <ul class="list-disc ml-5 md:ml-8 mb-5 text-sm text-primary-700">
              <li>
                Ensure that you have uploaded the necessary project-specific
                audit documents, if utilizing document types that are subject to
                audit. For more details about how document sharing and audits
                occur, view pages 7-9 of the
                <a
                  class="text-sm text-primary-700"
                  href="https://resources.wellcertified.com/tools/well-ratings-guidebook/"
                  target="_blank"
                  >WELL Ratings Guidebook</a
                >.
              </li>
              <li>
                Provide the required information for all locations included in
                your submission, utilizing the
                <a
                  href="https://cdn.wellcertified.com/resources/health-safety/WELL-health-safety-rating-locations-sqft.xlsm"
                  target="_blank"
                  >locations template</a
                >.
              </li>
            </ul>
          </li>
        </ul>
        <p class="text-sm text-primary-700">
          If you have any questions, please contact us in the Support widget
          from the support page.
        </p>
      </div>
      <WFeedbackModal ref="modal">
        <SharedReviewSubmitScreen :project="project" />
      </WFeedbackModal>
      <div
        v-if="
          sharedWorkspace.no_of_assets !== 1 &&
          sharedWorkspace.no_of_assets < sharedWorkspace.total_property_count
        "
        class="rounded-md bg-yellow-50 p-4 mb-5 rounded-lg border border-yellow-300"
      >
        <div class="flex">
          <div class="ml-3">
            <div class="mt-2 text-sm leading-5 text-yellow-700">
              Hmm. It appears we do not yet have enough information about each
              location pursuing a rating. Please use the Locations tab to
              provide us some basic information about each enrolled location and
              then resubmit.
            </div>
          </div>
        </div>
      </div>
      <div
        class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg mt-5 overflow-x-scroll"
      >
        <table v-if="allReviews && allReviews.length" class="table-auto w-full">
          <thead>
            <tr class="uppercase text-primary-600 bg-gray-50 px-3 text-xs">
              <th class="text-left p-4">Review Phase</th>
              <th class="text-left p-4">Submitted On</th>
              <th class="text-left p-4">Status</th>
              <th class="text-left p-4">Estimated Review Date</th>
              <th class="text-left p-4">Reviewed On</th>
              <th class="text-left p-4">Actions</th>
            </tr>
          </thead>

          <tbody class="text-left">
            <tr v-for="(reviewList, index) in allReviews" :key="index">
              <td class="p-4 text-sm">
                <div class="text-sm leading-5">
                  {{ reviewList.phase }}
                </div>
                <div
                  v-if="reviewList.is_hsr"
                  class="text-sm leading-5 px-2 inline-flex rounded-full bg-primary-600 text-white"
                >
                  WELL Performance Rating
                </div>
              </td>
              <td class="p-4 text-sm text-center">
                {{ $dayjs(reviewList.created_at).format('MMM DD, YYYY') }}
              </td>
              <td class="text-center">
                <span
                  v-if="
                    reviewList.status === 'reviewed' &&
                    reviewList.payment_status === 'paid'
                  "
                  class="text-center badge-info whitespace-nowrap uppercase p-1 bg-primary-900 text-white rounded-full px-2 text-xs font-semibold"
                  style="font-size: 10px"
                  >Completed
                </span>
                <span
                  v-if="reviewList.status === 'pending'"
                  class="text-center badge-info whitespace-nowrap uppercase p-1 bg-yellow-400 text-white rounded-full px-2 text-xs font-semibold"
                  style="font-size: 10px"
                  >In Progress
                </span>
                <span
                  v-if="reviewList.status === 'mid-review'"
                  class="text-center badge-info whitespace-nowrap uppercase p-1 bg-primary-500 text-white rounded-full px-2 text-xs font-semibold"
                  style="font-size: 10px"
                  >require clarification
                </span>
                <span
                  v-if="
                    reviewList.status === 'payment-pending' ||
                    (reviewList.status === 'reviewed' &&
                      reviewList.payment_status === 'unpaid')
                  "
                  class="text-center badge-info whitespace-nowrap uppercase p-1 bg-red-600 text-white rounded-full px-2 text-xs font-semibold"
                  style="font-size: 10px"
                  >payment pending
                </span>
              </td>
              <td class="p-4 font-light text-sm text-center">
                <span v-if="reviewList.est_date">
                  {{ $dayjs(reviewList.est_date).format('MMM DD, YYYY') }}
                </span>
              </td>
              <td class="p-4 font-light text-sm text-center">
                {{
                  reviewList.review_date
                    ? $dayjs(reviewList.review_date).format('MMM DD, YYYY')
                    : '-'
                }}
              </td>
              <td class="p-4 font-light text-sm text-center">
                <a
                  href="#"
                  class="text-primary-600"
                  @click="viewDetails(reviewList.id, index)"
                  >View</a
                >
              </td>
            </tr>
          </tbody>
        </table>
        <AlertCard v-else class="mt-5 m-4">
          There are no reviews for this project.
        </AlertCard>
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
      <SharedReviewDetailsScreen
        :id="selectedReviewId"
        :project="project"
        :all-reviews="allReviews"
      />
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  props: {
    project: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      showreviewdetails: true,
      selectedReviewId: '',
      review: '',
    }
  },
  computed: {
    ...mapState({
      sharedWorkspace: (state) => state.shared.sharedWorkspace,
      allReviews: (state) => state.review.allReviews,
      recertificationList: (state) => state.recertification.recertificationList,
    }),
    showReviewButton() {
      let allow = false
      const recertifications = JSON.parse(
        JSON.stringify(this.recertificationList)
      )
      if (this.recertificationList.length) {
        const recert = recertifications.pop()
        if (recert.payment_status === 'paid') {
          allow = true
        } else {
          return false
        }
      }

      if (
        this.sharedWorkspace.total_property_count >= 1 &&
        this.sharedWorkspace.no_of_assets >= 1 &&
        this.sharedWorkspace.no_of_assets >=
          this.sharedWorkspace.total_property_count &&
        !this.pendingReview
      ) {
        allow = true
      } else {
        return false
      }

      return allow
    },
    showBanner() {
      let allow = false
      const recertifications = JSON.parse(
        JSON.stringify(this.recertificationList)
      )
      if (this.recertificationList.length) {
        const recert = recertifications.pop()
        if (recert.payment_status === 'paid') {
          allow = false
        } else {
          return true
        }
      }
      return allow
    },
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
  },
  async mounted() {
    await this.$store.dispatch('review/getSharedReviewList', this.project.id)
    if (this.project.wpr_scorecard_id) {
      await this.$store.dispatch(
        'scorecard/getHSRResponseSummary',
        this.project.wpr_scorecard_id
      )
    }
  },
  methods: {
    viewDetails(id, index) {
      this.showreviewdetails = false
      this.selectedReviewId = id
    },
    async backtolist() {
      await this.$store.dispatch('review/getSharedReviewList', this.project.id)
      this.showreviewdetails = true
    },
  },
}
</script>
