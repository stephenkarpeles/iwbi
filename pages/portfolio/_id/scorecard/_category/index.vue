<template>
  <div>
    <div class="w-full">
      <div class="flex justify-between">
        <WHeadingsHTwo
          heading="Scorecard Survey"
          class="text-primary-800 mb-5"
        />
        <div>
          <WButtonsBase type="primary" @click.native="saveExit"
            >Save and Exit</WButtonsBase
          >
        </div>
      </div>
      <WLinksBase
        icon="arrow-narrow-left"
        @click.native="
          $router.push(`/portfolio/${$route.params.id}/scorecard/survey`)
        "
      >
        Back to All Categories
      </WLinksBase>
    </div>
    <div class="flex space-x-4 mt-2">
      <div class="w-2/3">
        <div
          class="bg-primary-100 border border-primary-300 rounded-md shadow-sm"
        >
          <div class="flex">
            <div class="pl-8 py-8 w-2/3">
              <div>
                <div v-if="$route.params.category === 'design'">
                  <p
                    class="
                      text-primary-700
                      uppercase
                      font-semibold
                      text-xs
                      leading-5
                    "
                  >
                    Question Type
                  </p>
                  <div class="text-xl text-primary-800 font-semibold leading-8">
                    Design
                  </div>
                  <div
                    class="text-sm text-primary-800 leading-5 font-normal py-2"
                  >
                    {{ categoryCaption }}
                  </div>
                </div>
                <div v-if="$route.params.category === 'policy'">
                  <p
                    class="
                      text-primary-700
                      uppercase
                      font-semibold
                      text-xs
                      leading-5
                    "
                  >
                    Question Type
                  </p>
                  <div class="text-xl text-primary-800 font-semibold leading-8">
                    Policy
                  </div>
                  <div
                    class="text-sm text-primary-800 leading-5 font-normal py-2"
                  >
                    {{ categoryCaption }}
                  </div>
                </div>
                <div v-if="$route.params.category === 'operations'">
                  <p
                    class="
                      text-primary-700
                      uppercase
                      font-semibold
                      text-xs
                      leading-5
                    "
                  >
                    Question Type
                  </p>
                  <div class="text-xl text-primary-800 font-semibold leading-8">
                    Operations
                  </div>
                  <div
                    class="text-sm text-primary-800 leading-5 font-normal py-2"
                  >
                    {{ categoryCaption }}
                  </div>
                </div>
              </div>
            </div>
            <div class="self-end">
              <div v-if="$route.params.category === 'design'">
                <div class="self-end">
                  <img
                    src="/portfolio/screen/scorecard/design.png"
                    alt=""
                    srcset=""
                  />
                </div>
              </div>
              <div v-if="$route.params.category === 'policy'">
                <div class="self-end">
                  <img
                    src="/portfolio/screen/scorecard/category_policy.png"
                    alt=""
                    srcset=""
                    class="h-40"
                  />
                </div>
              </div>
              <div v-if="$route.params.category === 'operations'">
                <div class="self-end">
                  <img
                    src="/portfolio/screen/scorecard/category_operations.png"
                    alt=""
                    srcset=""
                    class="h-40"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <p class="text-lg font-semibold text-primary-900 leading-7 my-4">
            Select a question:
          </p>
          <div v-if="categoryData && categoryData.questions">
            <div
              v-for="(question, index) in categoryData.questions"
              :key="index"
              class="py-2"
            >
              <div
                class="
                  border border-primary-300
                  cursor-pointer
                  px-4
                  py-8
                  rounded
                  shadow
                "
                @click="
                  $router.push(
                    `/portfolio/${$route.params.id}/scorecard/${$route.params.category}/${index}`
                  )
                "
              >
                <div class="flex justify-between items-center">
                  <div class="flex items-center">
                    <div class="h-9 flex mr-3">
                      <span
                        v-if="percentComplete(index) === 100"
                        class="
                          relative
                          z-10
                          w-8
                          h-8
                          flex
                          items-center
                          justify-center
                          bg-primary-600
                          rounded-full
                          group-hover:bg-primary-800
                          group-focus:bg-primary-800
                          transition
                          ease-in-out
                          duration-150
                        "
                      >
                        <svg
                          class="w-5 h-5 text-white"
                          x-description="Heroicon name: check"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clip-rule="evenodd"
                          ></path>
                        </svg>
                      </span>
                      <span
                        v-else-if="
                          percentComplete(index) < 100 &&
                          percentComplete(index) > 0
                        "
                        class="
                          relative
                          z-10
                          w-8
                          h-8
                          flex
                          items-center
                          justify-center
                          bg-white
                          border-2 border-primary-600
                          rounded-full
                        "
                      >
                        <span
                          class="h-2.5 w-2.5 bg-primary-600 rounded-full"
                        ></span>
                      </span>

                      <span
                        v-else
                        class="
                          relative
                          z-10
                          w-8
                          h-8
                          flex
                          items-center
                          justify-center
                          bg-white
                          border-2 border-gray-300
                          rounded-full
                          group-hover:border-gray-400
                          group-focus:border-gray-400
                          transition
                          ease-in-out
                          duration-150
                        "
                      >
                        <span
                          class="
                            h-2.5
                            w-2.5
                            bg-transparent
                            rounded-full
                            group-hover:bg-gray-300
                            group-focus:bg-gray-300
                            transition
                            ease-in-out
                            duration-150
                          "
                        ></span>
                      </span>
                    </div>
                    <div>
                      <div
                        class="text-sm text-primary-600 leading-5 font-semibold"
                      >
                        {{ percentComplete(index) }} % Complete
                      </div>
                      <div
                        class="text-xl font-semibold text-primary-900 leading-7"
                      >
                        {{ question.title }}
                      </div>
                    </div>
                  </div>
                  <div>
                    <WIconsBase
                      type="primary"
                      class="text-primary-800"
                      icon="arrow-narrow-right"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else>
            <LoadingList />
          </div>
        </div>
      </div>
      <div class="w-1/3">
        <div class="border border-primary-300 rounded-md sticky top-20">
          <div class="flex justify-between relative">
            <div class="p-5 z-10">
              <div
                class="
                  text-xs
                  font-semibold
                  text-primary-600
                  leading-5
                  uppercase
                "
              >
                Take Action
              </div>
              <div
                class="
                  text-xl
                  font-bold
                  text-primary-900
                  leading-7
                  whitespace-nowrap
                "
              >
                Partners on the Journey
              </div>
              <div class="max-w-xl space-y-2 mt-2">
                <div v-if="$route.params.category === 'design'">
                  <p class="text-sm mb-4 leading-5">
                    Once subscribed, you can invite
                    <a
                      class="text-primary-600 font-bold cursor-pointer"
                      @click="
                        ;($refs.modaladditional.isHidden = false),
                          ($refs.modal.isHidden = true)
                      "
                      >additional members</a
                    >
                    to your portfolio team and request their expertise in
                    assessing the feasibility of achieving requirements at
                    specific locations.
                  </p>
                  <p class="text-sm mb-4 leading-5">
                    Once you’ve targeted a feature for implementation, you can
                    work with these professionals inside your portfolio
                    dashboard to track progress, share resources and upload
                    documentation.
                  </p>
                  <p class="text-sm mb-4 leading-5">
                    To engage any key design leaders for this survey, please
                    <strong
                      ><a
                        href="https://cdn.wellcertified.com/portfolio/survey-questions/WELL+Portfolio+Survey+Questions-+Design.pdf"
                        target="_blank"
                        >download</a
                      ></strong
                    >
                    the questions to review together.
                  </p>
                </div>
                <div v-if="$route.params.category === 'policy'">
                  <p class="text-sm mb-4 leading-5">
                    Once subscribed, you can invite
                    <a
                      class="text-primary-600 font-bold cursor-pointer"
                      @click="
                        ;($refs.modaladditional.isHidden = false),
                          ($refs.modal.isHidden = true)
                      "
                      >additional members</a
                    >
                    to your portfolio team and request their expertise in
                    assessing the feasibility of achieving requirements at
                    specific locations.
                  </p>
                  <p class="text-sm mb-4 leading-5">
                    Once you’ve targeted a feature for implementation, you can
                    work with these professionals inside your portfolio
                    dashboard to track progress, share resources and upload
                    documentation.
                  </p>
                  <p class="text-sm mb-4 leading-5">
                    To engage any key design leaders for this survey, please
                    <strong
                      ><a
                        href="https://cdn.wellcertified.com/portfolio/survey-questions/WELL+Portfolio+Survey+Questions-+Policy.pdf"
                        target="_blank"
                        >download</a
                      ></strong
                    >
                    the questions to review together.
                  </p>
                </div>
                <div v-if="$route.params.category === 'operations'">
                  <p class="text-sm mb-4 leading-5">
                    Once subscribed, you can invite
                    <a
                      class="text-primary-600 font-bold cursor-pointer"
                      @click="
                        ;($refs.modaladditional.isHidden = false),
                          ($refs.modal.isHidden = true)
                      "
                      >additional members</a
                    >
                    to your portfolio team and request their expertise in
                    assessing the feasibility of achieving requirements at
                    specific locations.
                  </p>
                  <p class="text-sm mb-4 leading-5">
                    Once you’ve targeted a feature for implementation, you can
                    work with these professionals inside your portfolio
                    dashboard to track progress, share resources and upload
                    documentation.
                  </p>
                  <p class="text-sm mb-4 leading-5">
                    To engage any key design leaders for this survey, please
                    <strong
                      ><a
                        class="text-primary-600 font-bold"
                        href="https://cdn.wellcertified.com/portfolio/survey-questions/WELL+Portfolio+Survey+Questions-+Operations.pdf"
                        target="_blank"
                        >download</a
                      ></strong
                    >
                    the questions to review together.
                  </p>
                </div>
                <div class="flex w-full">
                  <div class="mx-auto w-60">
                    <WLinksBase
                      link="https://www.wellcertified.com/directories/people"
                      target="_blank"
                    >
                      <WButtonsBase type="primaryInverted">
                        Visit people directory
                      </WButtonsBase>
                    </WLinksBase>
                  </div>
                </div>
              </div>
            </div>
            <div class="absolute bottom-0 right-0 opacity-40">
              <img
                src="/portfolio/screen/scorecard/partner-journey.png"
                alt=""
                srcset=""
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <WFeedbackModal ref="modaladditional" class="z-50">
      <div class="max-w-xl space-y-2 px-4">
        <div v-if="$route.params.category === 'design'">
          <div class="flex justify-between">
            <WHeadingsHThree
              heading="Design criteria often involve the following professionals"
            />
            <WIconsBase
              icon="x-circle"
              @click.native="$refs.modaladditional.isHidden = true"
            />
          </div>
          <ul class="text-sm mb-4 leading-5">
            <li>Real estate planning teams</li>
            <li>Design and construction teams</li>
            <li>Workplace delivery teams</li>
            <li>Project architects</li>
            <li>Mechanical, Electrical and Plumbing (MEP) engineers</li>
            <li>Building contractors</li>
            <li>Interior designers</li>
            <li>Landscape architects</li>
            <li>Lighting designers</li>
            <li>Acousticians</li>
            <li>Spatial planners</li>
            <li>Ergonomists</li>
            <li>
              and many other specialists who can contribute their expertise to
              creating physical spaces
            </li>
          </ul>
        </div>
        <div v-if="$route.params.category === 'policy'">
          <div class="flex justify-between">
            <WHeadingsHThree
              heading="Policy initiatives often involve the following professionals"
            />
            <WIconsBase
              icon="x-circle"
              @click.native="$refs.modaladditional.isHidden = true"
            />
          </div>
          <ul class="text-sm mb-4 leading-5">
            <li>Chief Wellness Officers and other executive sponsors</li>
            <li>Sustainability teams</li>
            <li>Human capital management teams</li>
            <li>Change management professionals</li>
            <li>Wellness consultants and vendors</li>
            <li>Workplace strategists</li>
            <li>Research teams</li>
            <li>Third party survey providers</li>
            <li>Staff training leaders</li>
            <li>Education providers</li>
            <li>Marketing professionals</li>
            <li>
              and many other leaders who work to drive organizational change
            </li>
          </ul>
        </div>
        <div v-if="$route.params.category === 'operations'">
          <div class="flex justify-between">
            <WHeadingsHThree
              heading="Operations protocols often involve the following professionals"
            />
            <WIconsBase
              icon="x-circle"
              @click.native="$refs.modaladditional.isHidden = true"
            />
          </div>
          <ul class="text-sm mb-4 leading-5">
            <li>Facilities maintenance teams</li>
            <li>Building operations teams</li>
            <li>Groundskeeping teams</li>
            <li>Purchasing departments</li>
            <li>Cleaning vendors</li>
            <li>Food and beverage vendors</li>
            <li>Performance testing agents</li>
            <li>
              and many other internal or external professionals who help to make
              your buildings run smoothly
            </li>
          </ul>
        </div>
      </div>
    </WFeedbackModal>
    <!-- <WFeedbackModal ref="modal" class="z-50">
      <div class="max-w-xl space-y-2 px-4">
        <div class="flex justify-between">
          <WHeadingsHThree
            class="text-primary-800"
            heading="Partners on the journey"
          />
          <WIconsBase
            icon="x-circle"
            @click.native="$refs.modal.isHidden = true"
          />
        </div>
        <div v-if="$route.params.category === 'design'">
          <p class="text-sm mb-4 leading-5">
            Once subscribed, you can invite
            <a
              class="text-primary-600 font-bold cursor-pointer"
              @click="
                ;($refs.modaladditional.isHidden = false),
                  ($refs.modal.isHidden = true)
              "
              >additional members</a
            >
            to your portfolio team and request their expertise in assessing the
            feasibility of achieving requirements at specific locations.
          </p>
          <p class="text-sm mb-4 leading-5">
            Once you’ve targeted a feature for implementation, you can work with
            these professionals inside your portfolio dashboard to track
            progress, share resources and upload documentation.
          </p>
          <p class="text-sm mb-4 leading-5">
            To engage any key design leaders for this survey, please
            <strong
              ><a
                href="https://cdn.wellcertified.com/portfolio/survey-questions/WELL+Portfolio+Survey+Questions-+Design.pdf"
                target="_blank"
                >download</a
              ></strong
            >
            the questions to review together.
          </p>
        </div>
        <div v-if="$route.params.category === 'policy'">
          <p class="text-sm mb-4 leading-5">
            Once subscribed, you can invite
            <a
              class="text-primary-600 font-bold cursor-pointer"
              @click="
                ;($refs.modaladditional.isHidden = false),
                  ($refs.modal.isHidden = true)
              "
              >additional members</a
            >
            to your portfolio team and request their expertise in assessing the
            feasibility of achieving requirements at specific locations.
          </p>
          <p class="text-sm mb-4 leading-5">
            Once you’ve targeted a feature for implementation, you can work with
            these professionals inside your portfolio dashboard to track
            progress, share resources and upload documentation.
          </p>
          <p class="text-sm mb-4 leading-5">
            To engage any key design leaders for this survey, please
            <strong
              ><a
                href="https://cdn.wellcertified.com/portfolio/survey-questions/WELL+Portfolio+Survey+Questions-+Policy.pdf"
                target="_blank"
                >download</a
              ></strong
            >
            the questions to review together.
          </p>
        </div>
        <div v-if="$route.params.category === 'operations'">
          <p class="text-sm mb-4 leading-5">
            Once subscribed, you can invite
            <a
              class="text-primary-600 font-bold cursor-pointer"
              @click="
                ;($refs.modaladditional.isHidden = false),
                  ($refs.modal.isHidden = true)
              "
              >additional members</a
            >
            to your portfolio team and request their expertise in assessing the
            feasibility of achieving requirements at specific locations.
          </p>
          <p class="text-sm mb-4 leading-5">
            Once you’ve targeted a feature for implementation, you can work with
            these professionals inside your portfolio dashboard to track
            progress, share resources and upload documentation.
          </p>
          <p class="text-sm mb-4 leading-5">
            To engage any key design leaders for this survey, please
            <strong
              ><a
                class="text-primary-600 font-bold"
                href="https://cdn.wellcertified.com/portfolio/survey-questions/WELL+Portfolio+Survey+Questions-+Operations.pdf"
                target="_blank"
                >download</a
              ></strong
            >
            the questions to review together.
          </p>
        </div>
        <div class="flex w-full">
          <div class="mx-auto w-60">
            <WLinksBase
              link="https://www.wellcertified.com/directories/people"
              target="_blank"
            >
              <WButtonsBase
                type="primaryInverted"
                @click.native="$refs.modal.isHidden = true"
              >
                Visit people directory
              </WButtonsBase>
            </WLinksBase>
          </div>
        </div>
      </div>
    </WFeedbackModal> -->
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
  layout: 'sidebar',
  head() {
    return {
      title: `Survey`,
    }
  },
  computed: {
    ...mapState('survey', ['categories', 'hasCategories']),
    calcPortfolioId() {
      const id = this.$route.params.id.toString().substring(5, 10)
      return parseInt(id)
    },
    categoryData() {
      // if (!this.hasCategories) {
      //   this.loadSurvey({ id: this.calcPortfolioId })
      // }
      return this.categories[this.$route.params.category] || null
    },
    categoryCaption() {
      if (this.$route.params.category === 'design') {
        return 'The WELL Building Standard recognizes that many behaviors are subconsciously dictated by external cues, and thus carefully considers interactions between humans and the built environment.'
      } else if (this.$route.params.category === 'policy') {
        return 'Leading organizations attract and retain the best talent by creating a workplace optimized for health and well-being. WELL Portfolio unifies various stakeholders, across real estate, design, operations, human resources, communications and others, to bring forth a common vision for wellness.'
      } else if (this.$route.params.category === 'operations') {
        return 'WELL Portfolio helps organizations leverage building performance data and occupant experience feedback to make informed decisions about areas it can improve in their maintenance and operations protocols.'
      }
      return ''
    },
  },
  async mounted() {
    await this.$store.dispatch('portfolio/getPortfolio', {
      id: this.$route.params.id,
    })
    if (!this.hasCategories) {
      this.loadSurvey({ id: this.calcPortfolioId })
    }
  },
  methods: {
    ...mapActions('survey', ['loadSurvey']),
    saveExit() {
      this.$router.push(`/portfolio/${this.$route.params.id}/scorecard/survey`)
      this.loadSurvey({ id: this.calcPortfolioId })
    },

    percentComplete(q) {
      if (
        this.hasCategories &&
        this.categoryData &&
        this.categoryData.questions[q]
      ) {
        const qData = this.categoryData.questions[q]
        const complete =
          qData.option_summary.yes +
          qData.option_summary.maybe +
          qData.option_summary.no
        return Math.floor(
          (complete / qData.option_summary.question_count) * 100
        )
      } else if (!this.hasCategories) {
        // this.loadSurvey({ id: this.calcPortfolioId })
      }
      return null
    },
  },
}
</script>
