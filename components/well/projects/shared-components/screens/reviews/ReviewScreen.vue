<template>
  <div>
    <div v-if="showreviewdetails" class="mb-5">
      <div class="flex">
        <WHeadingsHTwo :heading="`Project Reviews ${project.name}`" />
      </div>
    </div>
    <div v-if="showreviewdetails">
      <div
        :class="[
          project.d_and_o === 1 &&
          project.d_and_o_submitted !== 1 &&
          allReviews.filter(
            (review) =>
              review.phase === 'Preliminary Precertification Review' &&
              review.status === 'reviewed'
          ).length === 0
            ? 'w-80'
            : 'w-40',
          'mb-5',
        ]"
      >
        <WButtonsBase
          v-if="
            !pendingReview &&
            recertificationCheckPass &&
            project.agreement_status === 1 &&
            project.type !== 'v2-pilot-upgraded'
          "
          icon="plus"
          @click.native="$refs.modal.isHidden = false"
        >
          {{
            project.d_and_o === 1 &&
            project.d_and_o_submitted !== 1 &&
            allReviews.filter(
              (review) =>
                review.phase === 'Preliminary Precertification Review' &&
                review.status === 'reviewed'
            ).length === 0
              ? 'Submit for Precertification Review'
              : 'Submit Review'
          }}
        </WButtonsBase>
      </div>
      <!-- Modal HERE -->
      <WFeedbackModal ref="modal">
        <ProjectReviewSubmitScreen
          :project="project"
          :all-reviews="allReviews"
        />
      </WFeedbackModal>
      <div
        v-if="project.type !== 'v1'"
        class="rounded-md bg-primary-50 p-4 mb-5 rounded-lg border border-primary-300"
      >
        <div class="flex">
          <div class="ml-3">
            <div class="mt-2 text-sm leading-5 text-primary-700">
              Projects which wish to submit documentation ahead of substantial
              completion are encouraged to consider Precertification (WELL v1)
              or WELL Precertification (WELL v2), or to contact our WELL
              coaching team through the support tab.
            </div>
          </div>
        </div>
      </div>
      <div
        class="overflow-x-scroll shadow overflow-hidden border-b border-gray-200 sm:rounded-lg mt-5"
      >
        <!-- Logic For Reviews HERE -->
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
              <td class="p-0 md:p-4 text-sm">
                <div class="text-sm leading-5 md:px-0 px-4 md:pt-0 pt-4">
                  {{ reviewList.phase }}
                </div>
                <div
                  v-if="reviewList.is_hsr"
                  class="text-sm leading-5 px-2 mx-3 md:mx-0 inline-flex rounded-full bg-primary-600 text-white"
                >
                  WELL Health-safety
                </div>
              </td>
              <td class="p-4 text-sm text-center">
                {{ $dayjs(reviewList.created_at).format('MMM DD, YYYY') }}
              </td>
              <td class="text-center whitespace-nowrap">
                <span
                  v-if="reviewList.status === 'reviewed'"
                  class="text-center badge-info uppercase p-1 bg-primary-900 text-white rounded-full px-2 text-xs font-semibold"
                  style="font-size: 10px"
                  >Completed
                </span>
                <span
                  v-if="reviewList.status === 'pending'"
                  class="text-center badge-info uppercase p-1 bg-yellow-400 text-white rounded-full px-2 text-xs font-semibold"
                  style="font-size: 10px"
                  >In Progress
                </span>
                <span
                  v-if="reviewList.status === 'mid-review'"
                  class="text-center badge-info uppercase p-1 bg-primary-500 text-white rounded-full px-2 text-xs font-semibold"
                  style="font-size: 10px"
                  >require clarification
                </span>
                <span
                  v-if="reviewList.status === 'payment-pending'"
                  class="text-center badge-info uppercase p-1 bg-red-600 text-white rounded-full px-2 text-xs font-semibold"
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
      <ProjectReviewDetailsScreen
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
      allReviews: (state) => state.review.allReviews,
      recertificationList: (state) => state.recertification.recertificationList,
    }),
    recertificationCheckPass() {
      if (this.recertificationList) {
        if (!this.recertificationList.length) {
          return true
        } else {
          return !this.recertificationList.filter(
            (a) => a.payment_status === 'unpaid'
          ).length
        }
      }
      return null
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
    await this.$store.dispatch('review/getReviewList', this.project.id)
  },
  methods: {
    viewDetails(id, index) {
      this.showreviewdetails = false
      this.selectedReviewId = id
    },
    async backtolist() {
      await this.$store.dispatch('review/getReviewList', this.project.id)
      this.showreviewdetails = true
    },
  },
}
</script>
