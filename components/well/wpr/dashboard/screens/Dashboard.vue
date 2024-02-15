<template>
  <div>
    <div v-if="sharedWorkspace" class="lg:flex mt-4">
      <div class="lg:w-8/12 mb-4 md:mb-0">
        <div>
          <div class="flex items-center">
            <img src="/wpr/wpr-dashboard.png" alt="" />
            <h3 class="ml-4 text-2xl font-semibold text-primary-900">
              WELL Performance Rating
            </h3>
          </div>
          <h6 class="text-lg font-semibold mt-8 ml-1 text-primary-900">
            Congratulations on taking the first steps!
          </h6>
          <p
            class="text-base font-normal ml-1 mt-4 mb-6 leading-6 text-primary-900 text-opacity-60"
          >
            We look forward to supporting you on your journey to achieve your
            WELL Performance Rating goals. Check out below for a preview of
            what's ahead!
          </p>
        </div>
        <SharedSlider :slides="resources" />
        <div class="ml-1">
          <h4 class="text-lg font-semibold mt-4 mb-1 text-primary-900">
            RESOURCES
          </h4>
          <hr />
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-16 pt-8">
            <WCardsBase
              thumbnail="https://cdn.wellcertified.com/static/images/rating-guidebook.png"
              class="shadow-none"
              :height="true"
            >
              <div class="-mx-4">
                <div>
                  <span
                    class="text-sm font-semibold text-primary-900 text-opacity-50"
                    >{{ $dayjs('Mar 16,2020').format('MMM DD, YYYY') }}</span
                  >
                  <p class="text-base font-semibold text-primary-900">
                    WELL Ratings Guidebook
                  </p>
                  <p
                    class="text-sm font-normal text-primary-900 text-opacity-50"
                  >
                    A step-by-step guide to implementing and achieving WELL
                    Ratings.
                  </p>
                  <a
                    href="https://resources.wellcertified.com/tools/well-ratings-guidebook/"
                    target="_blank"
                    class="text-sm font-normal text-primary-600"
                    >See More</a
                  >
                </div>
              </div>
            </WCardsBase>

            <WCardsBase
              thumbnail="wpr/dashboard/tutorials-guidance.jpg"
              class="shadow-none"
              :height="true"
            >
              <div class="-mx-4">
                <div>
                  <span
                    class="text-sm font-semibold text-primary-900 text-opacity-50"
                    >{{ $dayjs('Oct 14,2020').format('MMM DD, YYYY') }}</span
                  >
                  <p class="text-base font-semibold text-primary-900">
                    Getting Started
                  </p>
                  <p
                    class="text-sm font-normal text-primary-900 text-opacity-50"
                  >
                    Additional tools and resources to guide you through creating
                    a checklist, submitting for review and achieving the rating.
                  </p>
                  <a
                    href=" https://well.support/getting-started-guide~e8b87299-6ea5-4b1e-ab07-da1234d3a971"
                    target="_blank"
                    class="text-sm font-normal text-primary-600"
                    >See More</a
                  >
                </div>
              </div>
            </WCardsBase>
          </div>
        </div>
      </div>
      <div class="lg:w-4/12 border-2 mt-4 lg:mt-52 lg:ml-4 rounded-md">
        <div class="mt-8 px-4 mb-4">
          <span class="text-sm font-semibold text-primary-600"
            >GETTING STARTED</span
          >
          <h6 class="text-lg font-semibold text-primary-900">
            Complete your checklist
          </h6>
          <p class="text-sm font-normal text-primary-900 text-opacity-50">
            Here are a few recommended tasks to begin your WELL Performance
            Rating:
          </p>
        </div>

        <hr class="mx-4" />
        <div class="mt-4 px-3 space-y-4">
          <WLinksBase
            link="https://resources.wellcertified.com/tools/well-ratings-guidebook/"
            target="_blank"
            type="blank"
            class="flex text-base font-semibold text-primary-600"
          >
            <div class="flex">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                if="svgComponent"
                class="mx-1 w-5 h-5"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              <div class="text-primary-900 ml-2">
                Review the ratings guidebook
              </div>
            </div>
            <p
              class="text-sm font-normal px-7 text-primary-900 text-opacity-50 ml-2"
            >
              Learn the requirements and process in order to earn your WELL
              Performance Rating
            </p>
          </WLinksBase>

          <WLinksBase
            type="blank"
            class="flex text-base font-semibold text-primary-600"
            :link="`/wpr/${sharedWorkspace.portfolio_number}/team`"
          >
            <div class="flex">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                if="svgComponent"
                class="mx-1 w-5 h-5"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                ></path>
              </svg>

              <div class="text-primary-900 ml-2">Build your team roster</div>
            </div>
            <p
              class="text-sm font-normal px-7 text-primary-900 text-opacity-50 ml-2"
            >
              Inviting collaborators to your team now can ensure they’re ready
              to work on the checklist together after launch.
            </p>
          </WLinksBase>

          <WLinksBase
            link=""
            type="blank"
            class="flex text-base font-semibold text-primary-600"
          >
            <div class="flex">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                if="svgComponent"
                class="mx-1 w-5 h-5"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              <div class="text-primary-900 ml-2">Compile locations list</div>
            </div>
            <p
              class="text-sm font-normal px-7 text-primary-900 text-opacity-50 ml-2"
            >
              Prior to submitting for review, complete the details for each
              location under the locations tab and the multiple locations form
            </p>
          </WLinksBase>

          <WLinksBase
            type="blank"
            class="flex text-base font-semibold text-primary-600"
            :link="`/wpr/${sharedWorkspace.portfolio_number}/promotions`"
          >
            <div class="flex">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                if="svgComponent"
                class="mx-1 w-5 h-5"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              <div class="text-primary-900 ml-2">Plan press or messaging</div>
            </div>
            <p
              class="text-sm font-normal px-7 text-primary-900 text-opacity-50 ml-2"
            >
              Utilize our PR Guidelines, IWBI Brand Guide and sample promotional
              materials, included in your enrollment
            </p>
          </WLinksBase>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="mx-auto text-center">
        <WLoadingSpinner class="mx-auto" />
        <div class="mt-3 text-primary-600">Loading Dashboard...</div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      resources: [
        { bgImg: '/wpr/slider/1.png' },
        { bgImg: '/wpr/slider/2.png' },
        { bgImg: '/wpr/slider/3.png' },
        { bgImg: '/wpr/slider/4.png' },
      ],
    }
  },
  computed: {
    ...mapState({
      sharedWorkspace: (state) => state.shared.sharedWorkspace,
    }),
  },
}
</script>
