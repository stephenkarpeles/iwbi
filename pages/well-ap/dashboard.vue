<template>
  <div>
    <div v-if="exam">
      <NavBreadcrumbs>
        <WHeadingsHTwo class="mb-2" heading="WELL AP Exam Registration" />
        <WStepsHorizontal
          :steps="[
            {
              name: 'REGISTER HERE',
              status: 'complete',
              link: '/well-ap/register',
            },
            {
              name: 'MAKE THE COMMITMENT',
              status: 'complete',
              link: '/well-ap/invoice',
            },
            {
              name: 'EXAM DASHBOARD',
              status: 'current',
              link: '/well-ap/dashboard',
            },
          ]"
        />
      </NavBreadcrumbs>
      <div class="relative bg-white rounded-lg shadow-md">
        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
          <div class="px-4 py-5 sm:px-6 flex flex-wrap">
            <div class="w-full lg:w-1/2 lg:pr-6">
              <WHeadingsHThree
                class="mb-3 xl:mb-10"
                heading="Your Exam Details"
              />
              <div class="mt-4 xl:mt-7 sm:col-span-1">
                <dt class="text-sm leading-5 font-medium text-gray-500">
                  Eligibility ID
                </dt>
                <dd class="mt-1 text-sm leading-5 text-gray-900 font-semibold">
                  {{ exam.eligibility_id }}
                </dd>
              </div>
              <div class="mt-4 xl:mt-7 sm:col-span-1">
                <dt class="text-sm leading-5 font-medium text-gray-500">
                  First 4 characters of your last name
                </dt>
                <dd class="mt-1 text-sm leading-5 text-gray-900 font-semibold">
                  {{ exam.last_name.substring(0, 4) }}
                </dd>
              </div>
              <div class="mt-4 xl:mt-7 sm:col-span-1">
                <dt class="text-sm leading-5 font-medium text-gray-500">
                  Exam Language
                </dt>
                <dd class="mt-1 text-sm leading-5 text-gray-900 font-semibold">
                  {{
                    languagesByAbreviation.find(
                      ({ value }) => value === exam.language
                    ).text
                  }}
                </dd>
              </div>
              <div class="mt-4 xl:mt-7 sm:col-span-1">
                <dt class="text-sm leading-5 font-medium text-gray-500">
                  Package
                </dt>
                <dd class="mt-1 text-sm leading-5 text-gray-900 font-semibold">
                  <span v-if="exam.bought_in_bundle === 0"> WELL AP Exam </span>
                  <span v-else> WELL AP exam preparation bundle </span>
                </dd>
              </div>
              <div class="mt-4 xl:mt-7 sm:col-span-1">
                <dt class="text-sm leading-5 font-medium text-gray-500">
                  Your exam registration to Prometric
                </dt>
                <dd class="mt-1 text-sm leading-5 text-gray-900 font-semibold">
                  {{ exam.prometric_status }}
                </dd>
              </div>
              <div class="mt-4 xl:mt-7 sm:col-span-1">
                <dt class="text-sm leading-5 font-medium text-gray-500">
                  Expires
                </dt>
                <dd class="mt-1 text-sm leading-5 text-gray-900 font-semibold">
                  <span v-if="exam.expiration_date != null">
                    {{
                      $dayjs(exam.expiration_date.substring(0, 10)).format(
                        'MMM DD, YYYY'
                      )
                    }}
                  </span>
                  <span v-else> Not yet available </span>
                </dd>
              </div>
              <div class="mt-4 xl:mt-7 sm:col-span-1">
                <dt class="text-sm leading-5 font-medium text-gray-500">
                  Receipt
                </dt>
                <dd class="mt-1 text-sm leading-5 text-gray-900 font-semibold">
                  <WLinksBase link="#">
                    <div @click="downloadInvoice">Download</div>
                  </WLinksBase>
                </dd>
              </div>
              <hr class="mt-7 mb-4" />
              <div class="text-sm leading-5 font-medium text-gray-500 mb-3">
                WELL AP Articles and FAQ's
              </div>
              <div class="inline-flex flex-col space-y-2">
                <WLinksBase
                  target="_blank"
                  link="https://resources.wellcertified.com/resources/articles/everything-you-need-to-know-about-the-well-ap-beta-exam"
                >
                  Everything you need to know about the WELL AP beta exam
                </WLinksBase>
                <WLinksBase
                  target="_blank"
                  link="https://resources.wellcertified.com/articles/your-roadmap-to-the-well-ap-exam/"
                >
                  Your roadmap to the WELL AP exam
                </WLinksBase>
                <WLinksBase
                  target="_blank"
                  link="https://resources.wellcertified.com/articles/the-well-ap-exam-is-now-online"
                >
                  The WELL AP exam is now online: Here’s what you need to know
                </WLinksBase>
                <WLinksBase
                  target="_blank"
                  link="https://resources.wellcertified.com/?type=faqs&tags=product%2FWELL%20AP&showFilters=true"
                >
                  Common WELL AP FAQ's
                </WLinksBase>
              </div>
            </div>
            <div class="w-full lg:w-1/2 mt-6 lg:mt-0">
              <WHeadingsHThree heading="Study Materials" />
              <div class="bg-primary-100 p-5">
                <div class="md:flex">
                  <div class="bg-primary-200 w-10 h-10 px-2 flex">
                    <svg
                      class="w-5 h-5 text-primary-800 mx-auto my-auto"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                      />
                    </svg>
                  </div>

                  <WHeadingsHFour
                    class="mb-5 md:ml-4 md:pr-10"
                    heading="Core Resources"
                  >
                    <div class="text-sm w-full">
                      <div class="text-light mb-10">
                        <u class="text-medium">New WELL AP Exam V2</u>
                        <p class="text-light mb-5">
                          Your core resources if you intend to sit for the WELL
                          AP exam on or after
                          <strong>September 20, 2021</strong>.
                        </p>
                        <ul class="list-disc pl-5 my-4">
                          <li>
                            <a
                              href="https://resources.wellcertified.com/tools/well-v2-or-q4-2020/"
                              target="_blank"
                              class="text-primary-500"
                              >WELL Building Standard, v2 with Q4 2020
                              addenda</a
                            >
                          </li>
                          <li>
                            <a
                              href="https://resources.wellcertified.com/tools/well-certification-guidebook-q3-q4-2020/"
                              target="_blank"
                              class="text-primary-500"
                              >WELL Certification Guidebook with Q3-Q4 2020
                              addenda</a
                            >
                          </li>
                          <li>
                            <a
                              href="https://resources.wellcertified.com/tools/well-portfolio-guidebook-q4-2020"
                              target="_blank"
                              class="text-primary-500"
                              >WELL Portfolio Guidebook with Q4 2020 addenda</a
                            >
                          </li>
                          <li>
                            <a
                              href="https://resources.wellcertified.com/tools/get-to-know-the-new-well-ap-exam/"
                              target="_blank"
                              class="text-primary-500"
                              >Get To Know The New WELL AP Exam</a
                            >
                          </li>
                        </ul>
                        <p class="text-light mb-5">
                          Please note: Those who sit for the WELL AP exam during
                          the beta phase will have to wait longer to receive
                          their exam results. Read more about the importance and
                          details of this delay<a
                            class="text-primary-500 hover:text-primary-400"
                            target="_blank"
                            href="https://resources.wellcertified.com/faqs/if-i-take-the-new-well-ap-exam-during-beta-how-long-will-i-wait-to-receive-my-results/"
                          >
                            here.
                          </a>
                        </p>
                      </div>
                    </div>
                  </WHeadingsHFour>
                </div>

                <div v-if="exam.bought_in_bundle === 2" class="md:flex">
                  <div class="bg-primary-200 w-10 h-10 px-2 flex">
                    <svg
                      class="w-5 h-5 text-primary-800 mx-auto my-auto"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                      />
                    </svg>
                  </div>
                  <WHeadingsHFour
                    class="mb-5 md:ml-4 md:pr-10"
                    heading="WELL AP Study Plan"
                  >
                    <div class="text-sm">
                      Stay on-track, engaged and prepared to meet your goals
                      with our 30-session study plan.
                    </div>
                  </WHeadingsHFour>
                </div>

                <div v-if="exam.bought_in_bundle === 1" class="md:flex">
                  <div class="bg-primary-200 w-10 h-10 px-2 flex">
                    <svg
                      class="w-5 h-5 text-primary-800 mx-auto my-auto"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                      />
                    </svg>
                  </div>
                  <WHeadingsHFour
                    class="mb-10 md:ml-4 md:pr-10"
                    heading="WELL AP Exam Prep Guide WebBook"
                  >
                    <div class="text-sm font-semibold">
                      To access the WELL AP Exam Preparation Guide 4th Edition:
                    </div>
                    <div class="pl-5 mt-4">
                      <ul class="text-sm list-disc">
                        <li>
                          Visit the ATP digital resources:
                          <a
                            class="text-primary-600"
                            href="https://www.atplearningresources.com/"
                            target="_blank"
                            >https://atplearningresources.com/</a
                          >
                        </li>
                        <li>Select <i>Create Account</i></li>
                        <li>
                          Enter serial key: {{ userATP }}, followed by
                          completing/submitting the required fields in the form.
                        </li>
                        <li>
                          Select your ATP exam Prep eTextbook and start
                          studying.
                        </li>
                      </ul>
                    </div>
                  </WHeadingsHFour>
                </div>
                <div class="md:flex">
                  <div class="bg-primary-200 w-10 h-10 px-2 flex">
                    <svg
                      class="w-5 h-5 text-primary-800 mx-auto my-auto"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                      />
                    </svg>
                  </div>
                  <WHeadingsHFour
                    class="mb-10 md:ml-4 md:pr-10"
                    heading="WELL AP Toolkit"
                  >
                    <div class="text-sm">
                      Access a
                      <a
                        href="https://www.wellcertified.com/toolkits/well-ap"
                        target="_blank"
                        class="text-primary-500"
                        >suite of free resources</a
                      >
                      to jumpstart your journey to becoming a WELL AP!
                    </div>
                  </WHeadingsHFour>
                </div>
                <!-- <div class="md:flex">
                  <div class="bg-primary-200 w-10 h-10 px-2 flex">
                    <svg
                      class="w-5 h-5 text-primary-800 mx-auto my-auto"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5 11C6.09375 11 7 10.125 7 9C7 7.90625 6.09375 7 5 7C3.875 7 3 7.90625 3 9C3 10.125 3.875 11 5 11ZM19 11C20.0938 11 21 10.125 21 9C21 7.90625 20.0938 7 19 7C17.875 7 17 7.90625 17 9C17 10.125 17.875 11 19 11ZM20 12H18C17.4375 12 16.9375 12.25 16.5625 12.5938C17.8438 13.2812 18.7188 14.5312 18.9375 16H21C21.5312 16 22 15.5625 22 15V14C22 12.9062 21.0938 12 20 12ZM12 12C13.9062 12 15.5 10.4375 15.5 8.5C15.5 6.59375 13.9062 5 12 5C10.0625 5 8.5 6.59375 8.5 8.5C8.5 10.4375 10.0625 12 12 12ZM14.375 13H14.125C13.4688 13.3125 12.75 13.5 12 13.5C11.2188 13.5 10.5 13.3125 9.84375 13H9.59375C7.59375 13 6 14.625 6 16.625V17.5C6 18.3438 6.65625 19 7.5 19H16.5C17.3125 19 18 18.3438 18 17.5V16.625C18 14.625 16.375 13 14.375 13ZM7.40625 12.5938C7.03125 12.25 6.53125 12 6 12H4C2.875 12 2 12.9062 2 14V15C2 15.5625 2.4375 16 3 16H5.03125C5.25 14.5312 6.125 13.2812 7.40625 12.5938Z"
                        fill="#3E3E3E"
                      />
                    </svg>
                  </div>
                  <WHeadingsHFour
                    class="mb-10 md:ml-4 md:pr-10"
                    heading="WELL Community"
                  >
                    <div class="text-sm">
                      Get started with
                      <a
                        href="https://community.wellcertified.com"
                        target="_blank"
                        class="text-primary-500"
                      >
                        WELL Community here.
                      </a>
                    </div>
                  </WHeadingsHFour>
                </div> -->
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-primary-900 mt-8 rounded-lg shadow-md">
        <div class="max-w-7xl mx-auto py-10 md:py-16 px-4 sm:px-6 lg:px-8">
          <div
            class="
              max-w-md
              mx-auto
              md:max-w-none md:grid md:grid-cols-2 md:gap-8
            "
          >
            <div class="max-w-md">
              <h2
                class="
                  text-2xl
                  leading-8
                  font-extrabold
                  text-white
                  lg:text-3xl
                  sm:leading-9
                "
              >
                Schedule at a Testing Center
              </h2>
              <div class="mt-3">
                <p
                  class="
                    text-base
                    lg:text-lg
                    leading-6
                    lg:leading-7
                    text-primary-200
                  "
                >
                  If you would like to schedule your exam at a Prometric testing
                  center:
                </p>
              </div>
              <div class="mt-9">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <svg
                      class="h-6 w-6 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </div>
                  <div class="ml-3 text-base leading-6 text-primary-200">
                    <p>
                      Find a
                      <a
                        href="https://proscheduler.prometric.com/scheduling/findAvailabilitylocation"
                        target="_blank"
                        >Prometric testing center</a
                      >
                      near you
                    </p>
                  </div>
                </div>
                <div class="mt-6 flex">
                  <div class="flex-shrink-0">
                    <svg
                      class="h-6 w-6 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div class="ml-3 text-base leading-6 text-primary-200">
                    <p>
                      Review the Pre-Exam Checklist within the
                      <a
                        href="https://resources.wellcertified.com/tools/well-ap-candidate-handbook/"
                        target="_blank"
                        >WELL AP Candidate Handbook</a
                      >
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-10 sm:mt-16 md:mt-0">
              <h2
                class="
                  text-2xl
                  leading-8
                  font-extrabold
                  text-white
                  sm:text-3xl sm:leading-9
                "
              >
                Schedule Online
              </h2>
              <div class="mt-3">
                <p class="text-lg leading-7 text-primary-200 max-w-md">
                  If you would like to schedule a remotely proctored online
                  exam:
                </p>
              </div>
              <div class="mt-9">
                <div class="flex flex-wrap max-w-md">
                  <div class="w-full text-base leading-6 text-primary-200">
                    <p>
                      1. Ensure that your computer meets the technical
                      specifications by completing a
                      <a
                        href="https://rpcandidate.prometric.com/Home/SystemCheck"
                        target="_blank"
                        >systems readiness check</a
                      >
                    </p>
                  </div>
                  <div class="w-full mt-6 text-base leading-6 text-primary-200">
                    <p>
                      2. Review the Pre-Exam Checklist in the
                      <a
                        href="https://resources.wellcertified.com/tools/well-ap-candidate-handbook/"
                        target="_blank"
                        >WELL AP Candidate Handbook</a
                      >
                    </p>
                  </div>
                  <div class="w-full mt-6 text-base leading-6 text-primary-200">
                    <p>
                      3. Verify that you can adhere to the testing environment
                      requirements outlined in the
                      <a
                        href="https://www.prometric.com/sites/default/files/2019-10/PrometricProUserGuide.pdf"
                        target="_blank"
                        >ProProctor User Guide</a
                      >.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            class="
              w-full
              flex flex-col
              md:flex-row
              text-center
              justify-between
              mt-8
              md:mt-16
            "
          >
            <div
              class="
                md:w-1/2
                flex flex-col
                items-center
                space-y-2
                md:pr-8
                mb-2
                md:mb-0
              "
            >
              <a
                href="https://proscheduler.prometric.com/?prg=IWBI&path=schd"
                target="_blank"
                class="w-full"
              >
                <WButtonsBase type="primaryInverted">
                  Schedule v2 [beta] exam
                </WButtonsBase>
              </a>
            </div>
            <div class="md:w-1/2 md:px-4 flex flex-col space-y-2">
              <a
                href="https://www.prometric.com/iwbi"
                target="_blank"
                class="w-full"
              >
                <WButtonsBase> Schedule v2 [beta] exam </WButtonsBase>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="h-screen w-full mt-14">
      <div class="mx-auto text-center">
        <WLoadingSpinner class="mx-auto" />
        <div class="mt-3 text-primary-600">Loading Exam Dashboard...</div>
      </div>
    </div>
  </div>
</template>
<script>
import { createNamespacedHelpers } from 'vuex'
const { mapState: mapExamState, mapActions: mapExamActions } =
  createNamespacedHelpers('exam')
const { mapState: mapLangState } = createNamespacedHelpers('languages')
export default {
  data() {
    return {
      userATP: '',
    }
  },
  head() {
    return {
      title: `WELL AP Dashboard`,
    }
  },
  computed: {
    ...mapExamState(['exam']),
    ...mapLangState(['languagesByAbreviation']),
  },
  mounted() {
    if (this.$route.query.purchased === 'true' && window.analytics) {
      window.analytics.track('Product Purchased', {
        product: 'WELL AP',
      })
    }
  },
  async created() {
    return await this.getExams()
      .then(() => {
        this.$store
          .dispatch('user/getUserATP', this.exam.user_id)
          .then((res) =>
            res[0] ? (this.userATP = res[0].code) : (this.userATP = '')
          )
      })
      .catch((error) => (this.error = error))
  },
  methods: {
    ...mapExamActions(['getExams', 'downloadInvoice']),
  },
}
</script>
