<template>
  <div v-if="portfolio" class="flex flex-col space-y-6">
    <div class="w-full">
      <!-- Modals -->
      <WFeedbackModal ref="subscribeModal" class="z-10">
        <div class="max-w-xl text-primary-900">
          <WHeadingsHTwo heading="Subscribe" />
          <p class="mb-2">
            For the first term, the minimum commitment is a five-year
            subscription. Subscription can occur concurrently at the point of
            enrollment, or anytime within the enrollment period, provided the
            member has defined its portfolio scope.
          </p>
          <p>A WELL Portfolio subscription includes:</p>
          <ul class="list-disc list-inside">
            <li>
              Documentation and review of performance testing results of WELL v2
              features by Green Business Certification Inc. (GBCI), which
              contributes to:
              <ul class="list-disc list-inside pl-5">
                <li>
                  An overall WELL Portfolio Score™ for the defined portfolio.
                </li>
                <li>
                  WELL Certification, recertification and/or WELL
                  Precertification designation for all qualifying projects
                  within the defined portfolio.
                </li>
              </ul>
            </li>
            <li>Dashboard of portfolio and project performance.</li>
            <li>
              Opportunities for members to be recognized as leaders in health
              and well-being, from annual scores to recognition for specific
              progress or accomplishments – in addition to communications
              guidelines and templates to promote WELL Portfolio participation
              and accomplishments.
            </li>
            <li>
              Dedicated coaching support to help members assess their portfolio
              on health and well-being strategies, as well as identify
              opportunities for improvements and recognition.
            </li>
            <li>
              Complimentary IWBI membership at the Portfolio level for the
              duration of the subscription.
            </li>
          </ul>
          <p class="mt-2">
            Organizations interested in reviewing pricing for a WELL Portfolio
            subscription can visit the billing tab. Subscription costs do not
            include fees associated with onsite performance testing for relevant
            WELL v2 features, as these fees are assessed by the WELL Performance
            Testing Agent contracted by the WELL Portfolio member. WELL
            Portfolio participants can also deploy in-house WELL Performance
            Testing Agents. Separate fees for other optional services may also
            apply.
          </p>
          <p class="mt-2">
            Please refer to the
            <a
              class="text-primary-500"
              href="https://resources.wellcertified.com/resources/tools/well-portfolio-guidebook"
              target="_blank"
              >WELL Portfolio Guidebook</a
            >
            for additional details.
          </p>
        </div>
      </WFeedbackModal>
      <WFeedbackModal ref="activateSubscriptionModal" class="z-10">
        <div class="max-w-md text-primary-900">
          <WHeadingsHTwo heading="Portfolio composition" />

          <span
            >Can you confirm you have completed the locations list in your
            account and that this list meets the minimum program
            requirements?</span
          >
          <WButtonsBase
            type="primary"
            class="mt-3"
            @click.native="activateSubscription()"
            >Yes, let’s confirm with my coach.</WButtonsBase
          >
        </div>
      </WFeedbackModal>
      <!-- header -->
      <div class="w-2/3">
        <div v-if="regStatus === 'pre-enrolled'">
          <h6 class="text-lg font-semibold mt-8 ml-1 text-primary-900">
            Join us on the journey
          </h6>
          <p
            class="
              text-base
              font-normal
              ml-1
              mt-2
              mb-6
              leading-6
              text-primary-900 text-opacity-60
            "
          >
            Visualize and track progress, collaborate on improvements and share
            resources across your organization with our robust digital tools.
          </p>
        </div>
      </div>
      <div class="grid grid-cols-1 gap-y-6 lg:gap-x-6 lg:grid-cols-3">
        <!-- Banner / Slider -->
        <section class="col-span-2">
          <div class="flex flex-col space-y-4">
            <div class="w-full">
              <SharedSlider
                v-if="regStatus === 'pre-enrolled'"
                :slides="banner"
              />
              <SharedSlider
                v-if="regStatus === 'enrolled'"
                :slides="[
                  {
                    preTitle: 'assessment',
                    title: 'Build your scorecard',
                    description:
                      'This short exercise is an efficient way to recognize the opportunities that WELL provides, prior to expending additional resources on detailed assessments.',
                    bgImg: '/portfolio/screen/banner2-bg.png',
                    button: {
                      text: surveyCompleted
                        ? 'Continue'
                        : surveyStarted && !surveyCompleted
                        ? 'Finish Survey'
                        : 'Start Now',
                      url:
                        surveyStarted && surveyCompleted
                          ? `/portfolio/${portfolio.portfolio_number}/scorecard`
                          : `/portfolio/${portfolio.portfolio_number}/scorecard/survey`,
                    },
                  },
                  {
                    preTitle: 'assessment',
                    title: 'Define your portfolio',
                    description: `To participate, WELL Portfolio members must enroll with a defined portfolio that consists of at least 10 locations, or no less than 5 if their entire global portfolio is less than 10.
                    <br>
                    <div class='flex space-x-3 my-2 text-primary-500 text-sm'>
                      <div>${
                        portfolio.location ? portfolio.location.length : '0'
                      } Locations</div>
                      <div>${roundTotalArea(
                        portfolio.total_property_area
                      )} sqft</div>
                    </div>
                    `,
                    bgImg: '/portfolio/screen/banner2-bg.png',
                    button: {
                      text:
                        portfolio.sub_status == 1
                          ? 'View locations'
                          : portfolio.total_property_count
                          ? 'Manage locations'
                          : 'Add locations',
                      url: `/portfolio/${portfolio.portfolio_number}/properties`,
                    },
                  },
                  {
                    preTitle: 'assessment',
                    title: 'Activate your subscription',
                    description:
                      portfolio.sub_status == 1
                        ? 'Your coach will be reaching out soon with more details'
                        : 'Once you have built your scorecard and defined your portfolio, you can proceed with activating your subscription.',
                    bgImg: '/portfolio/screen/banner2-bg.png',
                    button:
                      portfolio.sub_status !== 1
                        ? {
                            text:
                              portfolio.sub_status !== 1 ? 'Upgrade now' : null,
                            url: `/portfolio/${portfolio.portfolio_number}/properties`,
                          }
                        : null,
                  },
                ]"
              />
              <SharedSlider
                v-else-if="regStatus === 'subscribed'"
                :slides="[
                  {
                    preTitle: 'assessment',
                    title: 'Set your achievement targets',
                    description:
                      'Conduct more detailed assessments of the strategies you were supportive of during the enrollment period to determine which to target for achievement.',
                    bgImg: '/portfolio/screen/banner2-bg.png',
                    button: {
                      text: 'Begin Assessment',
                      url:
                        portfolio.survey_completed === 0
                          ? `/portfolio/${portfolio.portfolio_number}/scorecard/survey`
                          : `/portfolio/${portfolio.portfolio_number}/scorecard`,
                    },
                  },
                  {
                    preTitle: 'WELL BUILDING STANDARD',
                    title: 'Prepare your documentation',
                    description:
                      'WELL sets the bar for the world’s best buildings and enables organizations to quantify and measure key health and well-being metrics across their portfolio.',
                    bgImg: '/portfolio/screen/banner3-bg.png',
                    button: {
                      actionType: 'external',
                      text: 'Review Instructions',
                      url: 'https://www.wellcertified.com/',
                    },
                  },
                  {
                    preTitle: 'WELL BUILDING STANDARD',
                    title: 'Schedule your review',
                    description:
                      'Initiate your first review cycle to earn your baseline WELL Portfolio Score',
                    bgImg: '/portfolio/screen/banner4-bg.png',
                    button: {
                      text: 'Request Now',
                      url: `/portfolio/${portfolio.portfolio_number}/reviews`,
                    },
                  },
                ]"
              />
            </div>
            <div class="w-full border border-primary-200 rounded-lg">
              <div
                v-if="regStatus === 'pre-enrolled'"
                class="
                  w-full
                  bg-cover bg-center
                  md:h-16
                  flex
                  items-center
                  py-6
                  md:py-8
                  px-6
                  md:px-0 md:pl-10
                  border-b-2
                  rounded-t-lg
                  border-primary-200
                "
                :style="{
                  backgroundImage:
                    'url(/portfolio/screen/dashboard/resources.jpg)',
                }"
              >
                <span class="text-lg text-primary-900 font-bold"
                  >Resources</span
                >
              </div>
              <div
                v-if="regStatus === 'enrolled'"
                class="
                  w-full
                  bg-cover bg-center
                  md:h-16
                  flex
                  items-center
                  py-6
                  md:py-8
                  px-6
                  md:px-0 md:pl-10
                  border-b-2
                  rounded-t-lg
                  border-primary-200
                "
                :style="{
                  backgroundImage:
                    'url(/portfolio/screen/dashboard/welcome.jpg)',
                }"
              >
                <div class="flex flex-col">
                  <span class="text-lg text-primary-900 font-bold"
                    >Welcome to WELL Portfolio</span
                  >
                  <span class="text-sm text-primary-900 opacity-60"
                    >Your coach will be reaching out soon!</span
                  >
                </div>
              </div>
              <div
                v-if="regStatus === 'subscribed'"
                class="
                  w-full
                  bg-cover bg-center
                  md:h-16
                  flex
                  items-center
                  py-6
                  md:py-8
                  px-6
                  md:px-0 md:pl-10
                  border-b-2
                  rounded-t-lg
                  border-primary-200
                "
                :style="{
                  backgroundImage:
                    'url(/portfolio/screen/dashboard/welcome.jpg)',
                }"
              >
                <div class="flex flex-col">
                  <span class="text-lg text-primary-600 font-bold"
                    >Welcome to WELL Portfolio</span
                  >
                  <span class="text-sm text-primary-900 opacity-60"
                    >You are subscribed</span
                  >
                </div>
              </div>
              <div
                v-if="regStatus === 'enrolled'"
                class="flex flex-col space-y-3 px-6 md:px-10 py-7"
              >
                <div
                  v-if="subscriptionTasksStarted"
                  class="flex flex-col space-y-2"
                >
                  <span class="text-primary-900 text-lg"
                    >Ready to build your WELL Portfolio Score?</span
                  >
                  <span class="text-sm text-primary-900 opacity-50"
                    >Subscribe now to begin deploying these strategies across
                    your portfolio. Once subscribed, you’ll be able to: invite
                    and manage your team, assess current achievement levels at
                    each location, track progress with dedicated scorecards,
                    share resources across your organization, submit
                    documentation for review and establish your WELL Portfolio
                    Score<sup>TM</sup></span
                  >
                  <div
                    v-if="
                      subscriptionTasksStarted && portfolio.sub_status !== 1
                    "
                  >
                    <span class="text-primary-900 opacity-50 italic text-xs"
                      >Submitting this will alert your coaching contact, who
                      will coordinate a review call.</span
                    >
                    <div
                      class="
                        md:flex md:space-x-3
                        space-y-3
                        md:space-y-3
                        items-center
                      "
                    >
                      <a
                        v-if="!subscriptionTasksReady"
                        class="text-primary-600 opacity-50"
                      >
                        Activate subscription
                      </a>
                      <a
                        v-else
                        class="text-primary-600 cursor-pointer"
                        @click="
                          $refs.activateSubscriptionModal.isHidden = false
                        "
                      >
                        Activate subscription
                      </a>

                      <div class="border-r-2 h-4 border-primary-600"></div>
                      <WLinksBase
                        type="primary"
                        @click.native="$refs.subscribeModal.isHidden = false"
                      >
                        Learn more
                      </WLinksBase>
                    </div>
                  </div>
                </div>
                <div v-else class="flex flex-col">
                  <span class="text-primary-900 text-lg font-bold"
                    >Getting started</span
                  >
                  <span class="text-sm text-primary-900 opacity-50 mt-2"
                    >Our platform can guide you through a brief review of the
                    strategies contained in the WELL Buildings Standard to begin
                    evaluating which best align with your goals. Our team can
                    then help you to define the desired scope of your engagement
                    and enter those locations into our platform for tracking
                    future progress.</span
                  >
                  <span class="text-sm text-primary-900 opacity-50"
                    >Once these steps are complete, your analyze dashboard will
                    serves as a valuable roadmap of the opportunities you have
                    identified for making an impact over time.</span
                  >
                </div>
              </div>
              <div
                v-if="regStatus === 'pre-enrolled'"
                class="flex flex-col space-y-6 px-6 md:px-10 py-5"
              >
                <div class="flex flex-col space-y-2">
                  <span class="text-primary-900 text-lg"
                    >Share WELL Portfolio with others</span
                  >
                  <span class="text-sm text-primary-900 opacity-50"
                    >Our team is excited to collaborate with you on the journey
                    to enhance health and well-being at your organization.</span
                  >
                  <WLinksBase
                    target="_blank"
                    link="https://resources.wellcertified.com/?type=tools&tags=product%2FWELL%20Portfolio&showFilters=true"
                  >
                    Access resources
                  </WLinksBase>
                </div>
                <div class="flex flex-col space-y-2">
                  <span class="text-primary-900 text-lg"
                    >Expand your expertise on WELL Portfolio</span
                  >
                  <span class="text-sm text-primary-900 opacity-50">
                    Your WELL Portfolio score is calculated from the average of
                    the points across the locations in your definied portfolio,
                    weighted by number of occupants in each project. You can
                    increase your score by having documentation and/or testing
                    results submitted and approved that correspond with WELL v2
                    features.
                  </span>
                  <WLinksBase
                    target="_blank"
                    link="https://www.wellcertified.com/portfolio/education"
                  >
                    Learn more
                  </WLinksBase>
                </div>
              </div>
              <div
                v-if="regStatus === 'subscribed'"
                class="flex flex-col space-y-3 px-6 md:px-10 py-7"
              >
                <div
                  v-if="subscriptionTasksStarted"
                  class="flex flex-col space-y-2"
                >
                  <span class="text-primary-600 text-lg"
                    >Continue on your WELL Portfolio journey</span
                  >
                  <div class="text-sm text-primary-900 opacity-50">
                    Work with your coaching contact to refine your goals for the
                    year ahead and, if you have not yet already, develop an
                    approach for your two annual review cycles. Within each of
                    the two review cycles, you are able to submit documentation
                    and performance testing results in order to achieve
                    individual features or milestones such as WELL
                    Certification, Precertification and the WELL Health-Safety
                    Rating.
                  </div>
                  <div class="text-sm text-primary-900 opacity-50">
                    Please let your coaching contact know if you need to add or
                    remove any properties throughout the year.
                  </div>
                </div>
                <div v-else class="flex flex-col">
                  <span class="text-primary-900 text-lg font-bold"
                    >Getting started</span
                  >
                  <span class="text-sm text-primary-900 opacity-50 mt-2"
                    >Our platform can guide you through a brief review of the
                    strategies contained in the WELL Buildings Standard to begin
                    evaluating which best align with your goals. Our team can
                    then help you to define the desired scope of your engagement
                    and enter those locations into our platform for tracking
                    future progress.</span
                  >
                  <span class="text-sm text-primary-900 opacity-50"
                    >Once these steps are complete, your analyze dashboard will
                    serves as a valuable roadmap of the opportunities you have
                    identified for making an impact over time.</span
                  >
                </div>
              </div>
            </div>
          </div>
        </section>
        <!-- Right side cards -->
        <section class="">
          <div
            v-if="regStatus === 'pre-enrolled'"
            class="flex flex-col space-y-6"
          >
            <div
              class="
                border border-primary-300
                rounded-md
                py-12
                px-4
                bg-cover bg-center
              "
              :style="{
                backgroundImage: 'url(/portfolio/screen/card-bg.png)',
              }"
            >
              <div v-if="unpaidStatus" class="flex flex-col">
                <span class="text-xs uppercase text-primary-600 font-semibold"
                  >Getting Started</span
                >
                <span class="text-lg text-primary-900 font-bold"
                  >Complete your enrollment</span
                >
                <span class="w-28 mt-2">
                  <WButtonsBase
                    type="primaryInverted"
                    @click.native="
                      $router.push(
                        `/portfolio/${portfolio.portfolio_number}/billing`
                      )
                    "
                    >Pay Invoice</WButtonsBase
                  >
                </span>
              </div>
              <div v-else class="flex flex-col">
                <div class="text-xs uppercase text-primary-600 font-semibold">
                  Getting Started
                </div>
                <div class="text-lg text-primary-900 font-bold">
                  Share your progress
                </div>
                <div class="text-sm text-gray-500">
                  Monitor and report ongoing improvements to investors,
                  employees and customers using our performance dashboard.
                </div>
                <span class="w-28 mt-2">
                  <WButtonsBase
                    type="primaryInverted"
                    @click.native="
                      $router.push(
                        `/portfolio/${portfolio.portfolio_number}/register`
                      )
                    "
                    >Enroll Now</WButtonsBase
                  >
                </span>
              </div>
            </div>
            <div
              class="border rounded-md border-primary-300 bg-primary-800 p-6"
            >
              <div class="">
                <span class="text-sm font-semibold text-primary-300"
                  >ENROLL</span
                >
                <h6 class="text-lg font-semibold text-primary-100">
                  Take the first step
                </h6>
                <p class="text-sm font-normal text-primary-200">
                  Beginning your WELL Portfolio experience is easy and
                  impactful. During this enrollment, you will:
                </p>
              </div>
              <hr class="border border-primary-600 my-3" />
              <div class="flex flex-col space-y-3">
                <div class="flex flex-col">
                  <span class="uppercase text-primary-50 text-sm font-semibold"
                    >Analysis</span
                  >
                  <span class="text-primary-50 text-sm mt-1"
                    >Conduct a brief analysis of how your organization aligns
                    with the healthy building strategies found in WELL.</span
                  >
                </div>

                <div class="flex flex-col">
                  <span class="uppercase text-primary-50 text-sm font-semibold"
                    >Collaborate</span
                  >
                  <span class="text-primary-50 text-sm mt-1"
                    >Collaborate with IWBI to define key goals and approaches
                    for applying these strategies across your portfolio.</span
                  >
                </div>

                <div class="flex flex-col">
                  <span class="uppercase text-primary-50 text-sm font-semibold"
                    >Track</span
                  >
                  <span class="text-primary-50 text-sm mt-1"
                    >Define your portfolio and track your locations inside our
                    performance dashboard.</span
                  >
                </div>

                <div class="flex flex-col">
                  <span class="uppercase text-primary-50 text-sm font-semibold"
                    >Benefits</span
                  >
                  <span class="text-primary-50 text-sm mt-1"
                    >Receive a complimentary year of WELL Portfolio membership
                    benefits.</span
                  >
                </div>
              </div>
            </div>
          </div>
          <div
            v-if="regStatus === 'enrolled'"
            class="border rounded-md border-primary-300 bg-primary-800 p-6"
          >
            <div class="">
              <span class="text-sm font-semibold text-primary-300 uppercase"
                >getting started</span
              >
              <h6 class="text-lg font-semibold text-primary-100">
                Complete your checklist
              </h6>
            </div>

            <hr class="border border-primary-600 my-3" />
            <div class="flex space-x-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-10 w-10 text-primary-50"
                fill="none"
                viewBox="0 0 20 20"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
              <div class="flex flex-col pt-3">
                <span class="uppercase text-primary-50 text-sm font-semibold"
                  >REVIEW WELL PORTFOLIO AGREEMENT</span
                >
                <span class="text-primary-50 text-sm my-2"
                  >Engage owners in reviewing and signing the legal agreement to
                  prepare for subscription activation.</span
                >
                <div
                  class="
                    md:flex md:space-x-3
                    space-y-3
                    md:space-y-3
                    items-center
                  "
                >
                  <WLinksBase
                    v-if="!portfolio.agreement_status"
                    type="secondary"
                    @click.native="initSendviaEmail()"
                  >
                    {{
                      !portfolio.envelope_id
                        ? 'Send to owner'
                        : 'Re-send to owner'
                    }}
                  </WLinksBase>
                  <div
                    v-if="!portfolio.agreement_status"
                    class="hidden md:block border-r-2 h-4 border-secondary-600"
                  ></div>
                  <WLinksBase
                    v-if="!portfolio.envelope_id"
                    type="secondary"
                    link="https://resources.wellcertified.com/tools/well-portfolio-agreement/"
                    target="_blank"
                  >
                    Download
                  </WLinksBase>
                  <WLinksBase
                    v-else
                    type="secondary"
                    target="_blank"
                    :link="`${$axios.defaults.baseURL}api/portfolio/agreement/${portfolio.id}/download?token=${$store.state.authentication.token}`"
                  >
                    Download
                  </WLinksBase>
                </div>
              </div>
            </div>
            <div class="flex space-x-3 my-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-10 w-10 text-primary-50"
                fill="none"
                viewBox="0 0 20 20"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                />
              </svg>

              <div class="flex flex-col pt-3">
                <span class="uppercase text-primary-50 text-sm font-semibold"
                  >ACTIVATE YOUR MEMBERSHIP</span
                >
                <span class="text-primary-50 text-sm my-2"
                  >As part of your portfolio enrollment, you recieve
                  complimentary WELL Portfolio membership benefits.</span
                >
                <div
                  class="
                    md:flex md:space-x-3
                    space-y-3
                    md:space-y-3
                    items-center
                  "
                >
                  <WLinksBase
                    type="secondary"
                    :link="`/portfolio/${portfolio.portfolio_number}/membership`"
                  >
                    Activate now
                  </WLinksBase>
                  <div
                    class="hidden md:block border-r-2 h-4 border-secondary-600"
                  ></div>
                  <WLinksBase
                    type="secondary"
                    target="_blank"
                    link="https://www.wellcertified.com/membership"
                  >
                    Learn more</WLinksBase
                  >
                </div>
              </div>
            </div>
            <div class="flex space-x-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-10 w-10 text-primary-50"
                fill="none"
                viewBox="0 0 20 20"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11"
                />
              </svg>

              <div class="flex flex-col pt-3">
                <span class="uppercase text-primary-50 text-sm font-semibold"
                  >GET HELP FROM YOUR COACH</span
                >
                <span class="text-primary-50 text-sm my-2"
                  >Collaborate with your dedicated IWBI coaching contact to help
                  evaluate and apply strategies across your portfolio.</span
                >
                <div
                  class="
                    md:flex md:space-x-3
                    space-y-3
                    md:space-y-3
                    items-center
                  "
                >
                  <WLinksBase
                    type="secondary"
                    :link="`/portfolio/${portfolio.portfolio_number}/support`"
                  >
                    Submit a question
                  </WLinksBase>
                </div>
              </div>
            </div>
          </div>
          <div
            v-if="regStatus === 'subscribed'"
            class="border rounded-md border-primary-300 bg-primary-800 p-6"
          >
            <div class="">
              <span class="text-sm font-semibold text-primary-300 uppercase"
                >getting started</span
              >
              <h6 class="text-lg font-semibold text-primary-100">
                Complete your checklist
              </h6>
            </div>

            <hr class="border border-primary-600 my-3" />
            <div class="flex space-x-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-10 w-10 text-primary-50"
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
              <div class="flex flex-col pt-3">
                <span class="uppercase text-primary-50 text-sm font-semibold"
                  >SIGN YOUR WELL PORTFOLIO AGREEMENT</span
                >
                <span class="text-primary-50 text-sm my-2"
                  >Prior to uploading documents, the portfolio owner needs to
                  review and sign the WELL Portfolio Agreement.</span
                >
                <div
                  class="
                    md:flex md:space-x-3
                    space-y-3
                    md:space-y-3
                    items-center
                  "
                >
                  <WLinksBase
                    v-if="!portfolio.agreement_status"
                    type="secondary"
                    @click.native="initSendviaEmail()"
                  >
                    {{
                      !portfolio.envelope_id
                        ? 'Send to owner'
                        : 'Re-send to owner'
                    }}
                  </WLinksBase>
                  <div
                    v-if="!portfolio.agreement_status"
                    class="hidden md:block border-r-2 h-4 border-secondary-600"
                  ></div>
                  <WLinksBase
                    v-if="!portfolio.envelope_id"
                    type="secondary"
                    link="https://resources.wellcertified.com/tools/well-portfolio-agreement/"
                    target="_blank"
                  >
                    Download
                  </WLinksBase>
                  <WLinksBase
                    v-else
                    type="secondary"
                    target="_blank"
                    :link="`${$axios.defaults.baseURL}api/portfolio/agreement/${portfolio.id}/download?token=${$store.state.authentication.token}`"
                  >
                    Download
                  </WLinksBase>
                </div>
              </div>
            </div>
            <div class="flex space-x-3 my-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-10 w-10 text-primary-50"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <div class="flex flex-col pt-3">
                <span class="uppercase text-primary-50 text-sm font-semibold"
                  >ASSEMBLE YOUR TEAM</span
                >
                <span class="text-primary-50 text-sm my-2"
                  >Invite any desired collaborators to the team inside your
                  portfolio account to provide feedback, upload documents and
                  track progress.</span
                >
                <div
                  class="
                    md:flex md:space-x-3
                    space-y-3
                    md:space-y-3
                    items-center
                  "
                >
                  <WLinksBase
                    type="secondary"
                    @click.native="
                      $router.push(
                        `/portfolio/${portfolio.portfolio_number}/team`
                      )
                    "
                  >
                    Invite now
                  </WLinksBase>
                </div>
              </div>
            </div>
            <div class="flex space-x-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-10 w-10 text-primary-50"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>

              <div class="flex flex-col pt-3">
                <span class="uppercase text-primary-50 text-sm font-semibold"
                  >UPDATE YOUR OCCUPANCY ESTIMATES</span
                >
                <span class="text-primary-50 text-sm my-2"
                  >Your WELL Portfolio Score is weighted by the number of people
                  who occupy your locations so be sure to add or update those
                  estimates.</span
                >
                <div
                  class="
                    md:flex md:space-x-3
                    space-y-3
                    md:space-y-3
                    items-center
                  "
                >
                  <WLinksBase
                    type="secondary"
                    @click.native="
                      $router.push(
                        `/portfolio/${portfolio.portfolio_number}/properties`
                      )
                    "
                  >
                    Add location details
                  </WLinksBase>
                </div>
              </div>
            </div>

            <div class="flex space-x-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-10 w-10 text-primary-50"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v11m0 5l4.879-4.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242z"
                />
              </svg>
              <div class="flex flex-col pt-3">
                <span class="uppercase text-primary-50 text-sm font-semibold"
                  >EXPLORE PERFORMANCE TESTING</span
                >
                <span class="text-primary-50 text-sm my-2"
                  >Individual locations are encouraged to establish a baseline
                  for how they are currently performing to inform any desired
                  improvements.</span
                >
                <div
                  class="
                    md:flex md:space-x-3
                    space-y-3
                    md:space-y-3
                    items-center
                  "
                >
                  <WLinksBase
                    type="secondary"
                    @click.native="
                      $router.push(
                        `/portfolio/${portfolio.portfolio_number}/performance`
                      )
                    "
                  >
                    Learn more
                  </WLinksBase>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      banner: [
        {
          preTitle: 'WELL BUILDING STANDARD',
          title: 'The world’s most advanced rating system',
          description:
            'WELL sets the bar for the world’s best buildings and enables organizations to quantify and measure key health and well-being metrics across their portfolio. Want to learn more about how WELL can support your goals?',
          bgImg: '/portfolio/screen/banner1-bg.png',
          button: {
            actionType: 'external',
            text: 'Get in touch',
            url: 'mailto:portfolio@wellcertified.com',
          },
        },
      ],
    }
  },
  computed: {
    ...mapState({
      portfolio: (state) => state.portfolio.portfolio,
      surveyStarted: (state) => state.portfolio.portfolio.survey_started,
      surveyCompleted: (state) => state.portfolio.portfolio.survey_completed,
    }),
    subscriptionTasksReady() {
      if (this.portfolio.total_property_count && this.surveyCompleted) {
        return true
      }

      return false
    },
    subscriptionTasksStarted() {
      if (
        this.portfolio.total_property_count ||
        this.surveyStarted ||
        this.surveyCompleted
      ) {
        return true
      }

      return false
    },
    regStatus() {
      if (this.portfolio) {
        const enrolled = this.portfolio.reg_payment_status === 'paid'
        const subscribed = this.portfolio.sub_payment_status === 'paid'

        if (subscribed && enrolled) {
          return 'subscribed'
        } else if (!subscribed && enrolled) {
          return 'enrolled'
        }

        return 'pre-enrolled'
      }
      return null
    },
    unpaidStatus() {
      if (this.portfolio) {
        if (
          this.portfolio.reg_status === 1 &&
          this.portfolio.reg_payment_status === 'unpaid'
        ) {
          return true
        }
      }
      return false
    },
  },

  methods: {
    async activateSubscription() {
      this.$refs.activateSubscriptionModal.isHidden = true
      // this.publishSubscriptionReady(true);
      await this.$store.dispatch('portfolio/getPortfolio', {
        id: this.$route.params.id,
      })
    },
    roundTotalArea(val) {
      if (val > 1e6) {
        return Math.round((val / 1e6) * 1000) / 1000 + 'M'
      } else if (val > 1e3) {
        return Math.round((val / 1e3) * 100) / 100 + 'K'
      }

      return val
    },
    initSendviaEmail() {
      this.$store
        .dispatch('portfolio/sendviaEmail', {
          id: this.portfolio.id,
          type: this.portfolio.type,
        })
        .then((res) => {
          this.$store.dispatch('portfolio/getPortfolio', {
            id: this.$route.params.id,
          })
          this.$store.dispatch('notifications/toastMessage', {
            message:
              'We have sent the Portfolio Agreement to the portfolio owner via email.',
          })
        })
    },
  },
}
</script>
