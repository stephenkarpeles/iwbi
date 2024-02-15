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
    </div>
    <div class="flex justify-between my-2">
      <div
        :class="
          this.$route.params.categoryid < 1 ? 'opacity-50' : 'opacity-100'
        "
      >
        <WLinksBase
          icon="arrow-narrow-left"
          icon-position="left"
          :disabled="this.$route.params.categoryid < 1 ? true : false"
          @click.native="makePreviousLink"
        >
          <span v-if="this.$route.params.categoryid < 1">
            Back: {{ questionData ? questionData.title : '' }}
          </span>
          <span v-else
            >Back: {{ questionDataBack ? questionDataBack.title : '' }}</span
          >
        </WLinksBase>
      </div>
      <WLinksBase
        icon-position="right"
        icon="arrow-narrow-right"
        @click.native="makeNextLink"
      >
        <span v-if="parseInt($route.params.categoryid) === totalQuestions - 1">
          Next: All Categories
        </span>
        <span v-else>
          Next: {{ questionDataNext ? questionDataNext.title : '' }}
        </span>
      </WLinksBase>
    </div>

    <div class="space-y-2 mb-4">
      <div
        class="bg-primary-100 border border-primary-300 rounded-md shadow-sm mb-4 w-full"
      >
        <div v-if="questionData" class="flex justify-between">
          <div class="py-8 pl-8 w-2/3">
            <div>
              <div v-if="$route.params.category === 'design'">
                <p
                  class="text-primary-700 uppercase font-semibold text-xs leading-5"
                >
                  Design
                </p>
                <div class="text-xl text-primary-800 font-semibold leading-8">
                  {{ questionData ? questionData.title : '' }}
                </div>
                <div
                  class="text-sm text-primary-800 leading-5 font-normal py-2"
                >
                  <div
                    v-html="questionData ? questionData.question_text : ''"
                  ></div>
                </div>
              </div>
              <div v-if="$route.params.category === 'policy'">
                <p
                  class="text-primary-700 uppercase font-semibold text-xs leading-5"
                >
                  Policy
                </p>
                <div class="text-xl text-primary-800 font-semibold leading-8">
                  {{ questionData ? questionData.title : '' }}
                </div>
                <div
                  class="text-sm text-primary-800 leading-5 font-normal py-2"
                >
                  <div
                    v-html="questionData ? questionData.question_text : ''"
                  ></div>
                </div>
              </div>
              <div v-if="$route.params.category === 'operations'">
                <p
                  class="text-primary-700 uppercase font-semibold text-xs leading-5"
                >
                  Operations
                </p>
                <div class="text-xl text-primary-800 font-semibold leading-8">
                  {{ questionData ? questionData.title : '' }}
                </div>
                <div
                  class="text-sm text-primary-800 leading-5 font-normal py-2"
                >
                  <div
                    v-html="questionData ? questionData.question_text : ''"
                  ></div>
                </div>
              </div>
            </div>
          </div>
          <div class="self-end">
            <div v-if="$route.params.category === 'design'">
              <div>
                <img
                  :src="
                    '/portfolio/screen/scorecard/questions/design/' +
                    $route.params.categoryid +
                    '.png'
                  "
                  alt=""
                  srcset=""
                  class="h-40"
                />
              </div>
            </div>
            <div v-if="$route.params.category === 'policy'">
              <div>
                <img
                  :src="
                    '/portfolio/screen/scorecard/questions/policy/' +
                    $route.params.categoryid +
                    '.png'
                  "
                  alt=""
                  srcset=""
                  class="h-40"
                />
              </div>
            </div>
            <div v-if="$route.params.category === 'operations'">
              <div>
                <img
                  :src="
                    '/portfolio/screen/scorecard/questions/operations/' +
                    $route.params.categoryid +
                    '.png'
                  "
                  alt=""
                  srcset=""
                  class="h-40"
                />
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="mx-auto text-center">
            <WLoadingSpinner class="mx-auto" />
            <div class="mt-3 text-primary-600">Loading ....</div>
          </div>
        </div>
      </div>
      <div class="bg-primary-900 text-white p-2 rounded mt-4">
        <div v-if="questionData && questionData.tips" class="flex">
          <div class="w-14">
            <WIconsBase icon="light-bulb" />
          </div>

          <p
            class="text-xs text-white leading-5 font-normal"
            v-html="questionData.tips"
          />
        </div>
      </div>
      <!-- <div class="w-1/3">
        <div class="border border-primary-300 rounded-md">
          <div class="flex justify-between">
            <div class="p-5">
              <div
                class="text-xs tracking-tighter font-semibold text-primary-600 leading-5 uppercase"
              >
                Take Action
              </div>
              <div
                class="text-2xl font-bold text-primary-900 whitespace-nowrap"
              >
                <span class="capitalize">{{ $route.params.category }}</span>
                survey
              </div>
              <div class="w-40 my-5">
                <WButtonsBase
                  type="primaryInverted"
                  @click.native="$refs.modal.isHidden = false"
                  >Learn More</WButtonsBase
                >
              </div>
            </div>
            <div class="self-end">
              <img
                src="/portfolio/screen/scorecard/partner-journey.png"
                alt=""
                srcset=""
              />
            </div>
          </div>
        </div>
      </div> -->
    </div>

    <div class="flex space-x-2">
      <div class="w-1/3">
        <div class="sticky top-16 max-w-xl">
          <div v-if="categoryData && categoryData.questions">
            <div
              v-for="(question, index) in categoryData.questions"
              :key="index"
              class="pb-2"
            >
              <div
                class="shadow rounded p-3 cursor-pointer"
                :class="
                  parseInt($route.params.categoryid) === index
                    ? 'border border-primary-800'
                    : 'border border-gray-300'
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
                        v-if="isComplete(question)"
                        class="relative z-10 w-8 h-8 flex items-center justify-center bg-primary-600 rounded-full group-hover:bg-primary-800 group-focus:bg-primary-800 transition ease-in-out duration-150"
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
                        v-else-if="isComplete(question) < 100"
                        class="relative z-10 w-8 h-8 flex items-center justify-center bg-white border-2 border-primary-600 rounded-full"
                      >
                        <span
                          class="h-2.5 w-2.5 bg-primary-600 rounded-full"
                        ></span>
                      </span>
                      <span
                        v-else
                        class="relative z-10 w-8 h-8 flex items-center justify-center bg-white border-2 border-gray-300 rounded-full group-hover:border-gray-400 group-focus:border-gray-400 transition ease-in-out duration-150"
                      >
                        <span
                          class="h-2.5 w-2.5 bg-transparent rounded-full group-hover:bg-gray-300 group-focus:bg-gray-300 transition ease-in-out duration-150"
                        ></span>
                      </span>
                    </div>
                    <div>
                      <div class="text-xm font-bold text-primary-800">
                        {{ question.title }}
                      </div>
                    </div>
                  </div>
                  <div>
                    <span
                      class="text-xm font-bold whitespace-nowrap text-primary-800"
                      v-html="completeFraction(question)"
                    ></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="w-full">
        <div>
          <div class="h-full">
            <div
              class="bg-primary-800 rounded-t-lg text-white py-2 sticky top-16 z-10"
            >
              <div class="text-xs flex justify-around w-64 ml-5 z-10">
                <div class="text-center">SUPPORTIVE</div>
                <div class="text-center">EXPLORE MORE</div>
                <div class="text-center">NOT INTERESTED</div>
              </div>
            </div>
            <ul
              v-if="$route.params.categoryid && questionData"
              ref="surveyOptions"
              class="p-3 border"
            >
              <li
                v-for="(option, index) in questionData.options"
                :key="index"
                class="mb-3"
              >
                <PortfolioOption
                  :option="option"
                  :category="$route.params.category"
                  :q-index="$route.params.categoryid"
                  :index="index"
                />
              </li>
            </ul>
            <div v-else>
              <LoadingList />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters, mapActions } from 'vuex'
export default {
  layout: 'sidebar',
  data() {
    return {}
  },
  computed: {
    ...mapState('survey', ['categories', 'hasCategories', 'questionCounts']),
    ...mapGetters({ surveyStatus: 'survey/surveyStatus' }),
    calcPortfolioId() {
      const id = this.$route.params.id.toString().substring(5, 10)
      return parseInt(id)
    },
    categoryData() {
      return this.categories[this.$route.params.category] || null
    },
    questionData() {
      const question = this.categories[this.$route.params.category]
        ? this.categories[this.$route.params.category].questions[
            this.$route.params.categoryid
          ]
        : null
      return question
    },
    questionDataNext() {
      const question = this.categories[this.$route.params.category]
        ? this.categories[this.$route.params.category].questions[
            parseInt(this.$route.params.categoryid) + 1
          ]
        : null
      return question
    },
    questionDataBack() {
      const question = this.categories[this.$route.params.category]
        ? this.categories[this.$route.params.category].questions[
            parseInt(this.$route.params.categoryid) - 1
          ]
        : null
      return question
    },
    totalQuestions() {
      if (this.categoryData && this.categoryData.questions) {
        return this.categoryData.questions.length
      }
      return 0
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
    makeNextLink() {
      const qNumber = parseInt(this.$route.params.categoryid)
      const qTotal = this.totalQuestions
      if (qNumber < qTotal - 1) {
        this.$router.push(
          '/portfolio/' +
            this.$route.params.id +
            '/scorecard/' +
            this.$route.params.category +
            '/' +
            (qNumber + 1)
        )
      } else if (qNumber === qTotal - 1) {
        this.$router.push(
          '/portfolio/' + this.$route.params.id + '/scorecard/survey'
        )
      }
    },
    makePreviousLink() {
      const qNumber = parseInt(this.$route.params.categoryid)
      if (qNumber > 0) {
        this.$router.push('' + (qNumber - 1))
      }
    },
    isComplete(question) {
      if (question) {
        const total = question.option_summary.question_count || -1
        const complete =
          question.option_summary.yes +
            question.option_summary.maybe +
            question.option_summary.no || -1

        return complete >= total
      }

      return false
    },
    completeFraction(question) {
      if (question) {
        const total = question.option_summary.question_count || 0
        const complete =
          question.option_summary.yes +
            question.option_summary.maybe +
            question.option_summary.no || 0

        return complete + ' / ' + total
      }
      return null
    },
  },
  head() {
    return {
      title: `Survey`,
    }
  },
}
</script>
