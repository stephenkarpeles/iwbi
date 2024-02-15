<template>
  <div>
    <div v-if="sharedWorkspace" class="lg:flex mt-4">
      <div class="lg:w-8/12 mb-4 md:mb-0">
        <div>
          <div class="flex items-center">
            <img src="/shared-workspace/health-safety-dashboard.png" alt="" />
            <h3 class="ml-4 text-2xl font-semibold text-primary-900">
              WELL Health-Safety Rating
            </h3>
          </div>
          <h6 class="text-lg font-semibold mt-8 ml-1 text-primary-900">
            Congratulations on taking the first steps!
          </h6>
          <p
            class="text-base font-normal ml-1 mt-4 mb-6 leading-6 text-primary-900 text-opacity-60"
          >
            We look forward to supporting you on your journey to achieve your
            WELL Health-Safety Rating goals. Check out below for a preview of
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
              thumbnail="shared-workspace/Driving-better-investment-decisions.png"
              class="shadow-none"
            >
              <div class="-mx-4">
                <div>
                  <span
                    class="text-sm font-semibold text-primary-900 text-opacity-50"
                    >{{ $dayjs('Mar 16,2020').format('MMM DD, YYYY') }}</span
                  >
                  <p class="text-base font-semibold text-primary-900">
                    Driving better investment decisions
                  </p>
                  <p
                    class="text-sm font-normal text-primary-900 text-opacity-50"
                  >
                    Learn how WELL is strengthening investment strategy by
                    driving organizational excellence and supporting ESG
                    performance.
                  </p>
                  <a
                    href="https://resources.wellcertified.com/tools/driving-better-investment-decisions/"
                    target="_blank"
                    class="text-sm font-normal text-primary-600"
                    >See More</a
                  >
                </div>
              </div>
            </WCardsBase>

            <WCardsBase
              thumbnail="shared-workspace/guidebook.png"
              class="shadow-none"
            >
              <div class="-mx-4">
                <div>
                  <span
                    class="text-sm font-semibold text-primary-900 text-opacity-50"
                    >{{ $dayjs('Oct 14,2020').format('MMM DD, YYYY') }}</span
                  >
                  <p class="text-base font-semibold text-primary-900">
                    WELL Health-Safety Rating Guidebook
                  </p>
                  <p
                    class="text-sm font-normal text-primary-900 text-opacity-50"
                  >
                    A step-by-step guide to implementing and achieving the WELL
                    Health-Safety Rating. Versions: Q2 2020 - Q4 2020
                  </p>
                  <a
                    href="https://a.storyblok.com/f/52232/x/0da851f648/well-health-safety-rating-guidebook-0630.pdf"
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
            Here are a few recommended tasks to begin your WELL Health-Safety
            Rating:
          </p>
        </div>

        <hr class="mx-4" />
        <div class="mt-4 px-3 space-y-4">
          <WLinksBase
            :link="`https://a.storyblok.com/f/52232/x/0da851f648/well-health-safety-rating-guidebook-0630.pdf`"
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
              <div class="text-primary-900 ml-2">Review program guidebook</div>
            </div>
            <p
              class="text-sm font-normal px-7 text-primary-900 text-opacity-50 ml-2"
            >
              Learn about how alternatives must be applied in order to earn your
              WELL Health-Safety Rating
            </p>
          </WLinksBase>

          <WLinksBase
            :link="`/shared-workspaces/${sharedWorkspace.portfolio_number}/promotions`"
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
              <div class="text-primary-900 ml-2">Plan press or messaging</div>
            </div>
            <p
              class="text-sm font-normal px-7 text-primary-900 text-opacity-50 ml-2"
            >
              Utilize our PR Guidelines, IWBI Brand Guide and sample promotional
              materials, included in your enrollment
            </p>
          </WLinksBase>

          <WLinksBase
            target="_blank"
            :link="'https://cdn.wellcertified.com/resources/health-safety/WELL-health-safety-rating-locations-sqft.xlsm'"
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
              <div class="text-primary-900 ml-2">Compile location details</div>
            </div>
            <p
              class="text-sm font-normal px-7 text-primary-900 text-opacity-50 ml-2"
            >
              Prior to submitting for review, we’ll need to know a bit more
              about each location in order to determine compliance
            </p>
          </WLinksBase>

          <WLinksBase
            type="blank"
            class="flex text-base font-semibold text-primary-600"
            @click.native="$store.commit('settings/setSidebarTab', 'Team')"
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
        { bgImg: '/shared-workspace/slider/1.jpg' },
        { bgImg: '/shared-workspace/slider/2.jpg' },
        { bgImg: '/shared-workspace/slider/3.jpg' },
        { bgImg: '/shared-workspace/slider/4.jpg' },
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
