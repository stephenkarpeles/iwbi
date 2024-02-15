<template>
  <div v-if="showSurveyData">
    <div class="flex items-center justify-between">
      <div class="flex space-x-2 items-center">
        <h3
          class="font-semibold text-primary-900"
          :class="$store.state.portfolio.analyzeMode ? 'text-2xl' : 'text-1xl'"
        >
          {{ $store.state.portfolio.analyzeMode ? 'Analyze' : 'Manage' }}
        </h3>

        <!-- v-if="portfolio.show_dashboard" -->
        <Flyout ref="conceptFlyout" y="bottom" x="right" class="h-full">
          <Toggle
            :value="$store.state.portfolio.analyzeMode"
            @click.native="
              () => {
                $store.commit('portfolio/setAnalyzeMode')
                $store.commit(
                  'settings/setNavState',
                  !$store.state.settings.navExpanded
                )
              }
            "
          />
          <template #content>
            <div class="p-3 w-56 text-primary-900 text-sm">
              Enable/Disable Analyze view
            </div>
          </template>
        </Flyout>
      </div>
    </div>

    <div class="flex justify-between mb-2">
      <WHeadingsHTwo heading="Review your WELL Scorecard" />
      <div class="flex justify-around">
        <WButtonsBase
          v-if="currentUser.role.includes('well-admin') && portfolio"
          class="whitespace-nowrap mr-2"
          @click.native="
            updateSurveyCompleted(false),
              $router.push({
                path: `/portfolio/${portfolio.portfolio_number}/scorecard/survey`,
                query: { ...$route.query },
              })
          "
        >
          Admin: Re-enable Survey
        </WButtonsBase>

        <WButtonsBase
          v-if="
            pMembers === 'portfolio-admin' || pMembers === 'portfolio-manager'
          "
          class="whitespace-nowrap mr-2"
          @click.native="downloadSurveyExcel"
        >
          Download Survey
        </WButtonsBase>
        <!-- <WButtonsBase @click.native="printCharts">
          Print Analysis
        </WButtonsBase> -->
      </div>
    </div>
    <div class="flex">
      <div
        class="
          w-1/2
          border-2 border-primary-100
          shadow
          rounded
          bg-primary-100
          p-4
          mr-4
        "
      >
        <WHeadingsHFour heading="Organizational Support" />
        <p class="text-primary-900 text-sm leading-5 pb-5">
          An important first step in your WELL Portfolio journey is to gauge how
          well the alternatives align with the mission, values and goals of an
          organization.
        </p>
        <p class="text-primary-900 text-sm leading-5">
          This short exercise is an efficient way to recognize the opportunities
          that WELL provides, prior to expending additional resources on
          detailed assessments. This reflects the proportion of WELL points that
          your organization is supportive of or would like to explore further.
        </p>
      </div>
      <div
        class="
          bg-primary-100
          flex flex-col
          items-center
          p-4
          rounded-md
          w-2/3
          relative
        "
      >
        <div>
          <span class="uppercase text-primary-800 text-2xl"
            >TOTALS BY RESPONSE
          </span>
          <Pie
            :styles="myBarStyles"
            :options="{
              hoverBorderWidth: 20,
              plugins: {
                legend: true,
              },
            }"
            :chart-data="{
              hoverBackgroundColor: 'red',
              hoverBorderWidth: 10,
              labels: [
                'Supportive',
                'Explore Further',
                'Not interested',
                'Unanswered',
              ],
              datasets: [
                {
                  label: 'Data One',
                  backgroundColor: ['#429FBC', '#C5E6F0', '#A7A7A7', '#EDEDED'],
                  data: surveyCounts,
                },
              ],
            }"
          />
        </div>
      </div>
    </div>
    <div class="flex mt-2">
      <div class="mt-4 w-2/3">
        <div class="shadow rounded bg-primary-100 p-4">
          <span class="uppercase text-primary-800 text-2xl"
            >TOTALS BY STRATEGY TYPE</span
          >
          <VerticalBar
            :key="forceReRender"
            :options="{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                yAxes: [
                  {
                    gridLines: {
                      display: false,
                    },
                    ticks: {
                      beginAtZero: true,
                      fontColor: '#84BFD2',
                      fontStyle: 'bold',
                    },
                  },
                ],
                xAxes: [
                  {
                    gridLines: {
                      display: false,
                    },
                    ticks: {
                      fontColor: '#84BFD2',
                      fontStyle: 'bold',
                    },
                  },
                ],
              },
            }"
            :chart-data="{
              labels: ['Design', 'Operations', 'Policy'],
              datasets: [
                {
                  align: 'center',
                  label: 'Supportive',
                  backgroundColor: '#429FBC',
                  data: getAnswerCountsByCategory('yes'),
                },
                {
                  align: 'center',
                  label: 'Explore Further',
                  backgroundColor: '#C5E6F0',
                  data: getAnswerCountsByCategory('maybe'),
                },
                {
                  align: 'center',
                  label: 'Not interested',
                  backgroundColor: '#EDEDED',
                  data: getAnswerCountsByCategory('no'),
                },
              ],
            }"
          />
        </div>
      </div>
      <div class="w-1/3 mt-4">
        <div class="bg-primary-100 rounded ml-4 p-4 pb-20">
          <div class="">
            <span class="text-sm font-semibold text-primary-300 uppercase"
              >getting started</span
            >
            <h6 class="text-lg font-semibold text-primary-900">
              Manage Scorecard
            </h6>
          </div>
          <p class="text-primary-900 leading-5 text-sm mb-5">
            Now you can start to explore the complete requirements of the WELL
            Building Standard, which contain the specific thresholds, scope and
            criteria needed for promoting a strategy’s health intent.
          </p>
          <p class="text-primary-900 leading-5 text-sm pb-5">
            Your scorecard will continue to be refined over time with the input
            of many team members throughout your WELL Portfolio journey. For
            enrollment, simply ensure the scorecard contains all points your
            organization may be interested in. In later phases, you can
            determine which will be targeted for achievement at the
            portfolio-level and at each property.
          </p>
          <WButtonsBase
            class="mb-5"
            @click.native="$store.commit('portfolio/setAnalyzeMode')"
          >
            Manage Scorecard
          </WButtonsBase>
        </div>
      </div>
    </div>
    <div class="shadow rounded bg-primary-100 mt-4 p-4">
      <PortfolioTotalPoint />
    </div>
    <div class="bg-primary-100 rounded mt-4">
      <div
        class="bg-primary-900 text-white px-4 py-2 rounded text-base uppercase"
      >
        Concept Breakdown
      </div>
      <div class="flex">
        <div class="mr-2 w-1/4">
          <div class="text-base font-bold leading-5 py-2 p-4 whitespace-nowrap">
            Concept Type
          </div>
          <div
            v-for="(concept, index) in surveyConceptNames"
            :key="index"
            :class="
              currentTab === concept.replace(/\s+/g, '-').toLowerCase()
                ? 'bg-primary-200 w-full'
                : ''
            "
          >
            <div
              class="text-primary-900 flex px-4 py-2"
              @click="changeConcept(concept)"
            >
              <img
                class="rounded-full w-4 h-4 items-center mr-2"
                :src="`/scorecard/icons/${concept
                  .replace(/\s+/g, '-')
                  .toLowerCase()}.png`"
              />

              <div class="text-xs font-bold">{{ concept }}</div>
            </div>
          </div>
        </div>
        <div class="flex w-3/4">
          <div
            v-for="(concept, index) in surveyConceptNames"
            :key="index"
            :class="{
              hidden: currentTab !== concept.replace(/\s+/g, '-').toLowerCase(),
            }"
            class="p-2 flex items-center"
          >
            <div
              v-if="currentTab === concept.replace(/\s+/g, '-').toLowerCase()"
            >
              <div class="flex justify-between mr-2">
                <div class="text-base font-bold leading-5">
                  {{ concept }}<br />
                  <span
                    class="text-xs italic"
                    v-html="
                      conceptDetailText[concept]
                        ? conceptDetailText[concept].subtitle
                        : ''
                    "
                  ></span>
                </div>
                <img
                  class="rounded-full w-8 mb-2"
                  :src="`/scorecard/icons/${concept
                    .replace(/\s+/g, '-')
                    .toLowerCase()}.png`"
                />
              </div>
              <p
                class="pt-4 text-sm leading-5"
                v-html="
                  conceptDetailText[concept]
                    ? conceptDetailText[concept].caption
                    : ''
                "
              />
            </div>
            <div
              v-if="currentTab === concept.replace(/\s+/g, '-').toLowerCase()"
              class="bg-primary-100 rounded-md w-3/4"
            >
              <div class="flex-col">
                <DoughnutChart
                  :styles="myDoughnutBreakdownStyles"
                  :options="{
                    responsive: true,
                    maintainAspectRatio: false,
                    legend: {
                      display: true,
                    },
                    animation: {
                      animateRotate: true,
                    },
                  }"
                  :chart-data="{
                    labels: [
                      'Supportive',
                      'Explore Further',
                      'Not interested',
                      'Undecided',
                    ],
                    datasets: [
                      {
                        backgroundColor: [
                          '#255565',
                          '#4094B0',
                          '#306F63',
                          '#D5D6D7',
                        ],
                        data: singleConceptAnswers(index),
                      },
                    ],
                  }"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <div class="mx-auto text-center py-5">
      <WLoadingSpinner class="mx-auto" />
      <div class="mt-3 text-primary-600">Loading analyze screen...</div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions, mapGetters } from 'vuex'
export default {
  props: {
    mode: {
      required: false,
      type: [Object, Array],
      default: null,
    },
  },
  data() {
    return {
      currentTab: 'air',
      forceReRender: 0,
      scorecardConceptScore: [],
      conceptDetailText: {
        Air: {
          subtitle: 'Breathe easy.',
          caption:
            'WELL promotes alternatives to reduce or minimize sources of indoor air pollution.',
        },
        Water: {
          subtitle: 'Drink up.',
          caption: 'WELL promotes access to high quality water.',
        },
        Nourishment: {
          subtitle: 'Dig in to wholesome foods.',
          caption:
            'WELL makes healthy foods the easy choice and encourages a better food culture.',
        },
        Light: {
          subtitle: 'Soak it in.',
          caption:
            'WELL promotes daylighting and electric lighting systems designed to increase alertness, enhance experience and promote optimal sleep patterns.',
        },
        Movement: {
          subtitle: 'Keep moving.',
          caption:
            'WELL encourages the integration of activity and fitness into everyday life.',
        },
        'Thermal Comfort': {
          title: 'Thermal comfort',
          subtitle: 'Get comfortable.',
          caption:
            'WELL optimizes the indoor environment and improves individual control to provide productive and comfortable indoor environments.',
        },
        Sound: {
          subtitle: 'Attune your focus.',
          caption:
            'WELL ensures optimal acoustical comfort to reduce distractions and promote focus.',
        },
        Materials: {
          subtitle: 'Be assured.',
          caption:
            'WELL improves respiratory health through use of safer materials and finishes.',
        },
        Mind: {
          subtitle: 'Stay centered.',
          caption:
            'WELL supports cognitive and emotional health through design, technology and treatment alternatives.',
        },
        Community: {
          subtitle: 'Be included.',
          caption:
            'WELL fosters community engagement and social support through improved access and proactive initiatives.',
        },
        Innovations: {
          subtitle: '',
          caption:
            'WELL encourages innovation features that pave the way for projects to develop unique alternatives for creating healthy environments.',
        },
        Innovation: {
          subtitle: '',
          caption:
            'WELL encourages innovation features that pave the way for projects to develop unique alternatives for creating healthy environments.',
        },
      },
    }
  },
  computed: {
    ...mapState('survey', [
      'categories',
      'hasCategories',
      'conceptScore',
      'conceptScore',
    ]),
    ...mapState({
      portfolio: (state) => state.portfolio.portfolio,
      currentUser: (state) => state.user.currentUser,
      portfolioMembers: (state) => state.portfolio.portfolioMembers,
    }),
    surveyConceptNames() {
      if (this.conceptScore) {
        return Object.keys(this.conceptScore).map((concept) => concept)
      }
      return {}
    },
    pMembers() {
      return this.portfolioMembers.map((member) => member.pivot.role)[0]
    },
    surveyCounts() {
      const counts = []
      const yes = this.getAnswerCounts('yes')
      const maybe = this.getAnswerCounts('maybe')
      const no = this.getAnswerCounts('no')
      let unanswered = this.getQuestionTotal() - yes - maybe - no

      unanswered = unanswered < 0 ? 0 : unanswered

      counts.push(yes, maybe, no, unanswered)
      return counts
    },
    showSurveyData() {
      return this.surveyStatus && this.surveyStatus.completed
    },
    ...mapGetters({
      surveyStatus: 'survey/surveyStatus',
    }),
    myDoughnutBreakdownStyles() {
      return {
        height: `300px`,
        position: 'relative',
      }
    },

    myBarStyles() {
      return {
        height: `400px`,
        width: `400px`,
        position: 'relative',
      }
    },
  },
  mounted() {
    this.loadSurvey()
    this.loadConceptScores()
  },
  methods: {
    ...mapActions('survey', ['loadSurvey', 'updateSurveyCompleted']),
    getAnswerCountsByCategory(answer) {
      if (this.hasCategories) {
        const answers = []

        Object.keys(this.categories).forEach((key, index) => {
          answers.push(this.categories[key].question_summary[answer])
        })
        return answers
      }

      return 0
    },
    loadConceptScores() {
      return new Promise((resolve, reject) => {
        this.$axios
          .get('api/scorecard/score/' + this.mode.module.scorecard_id + '/all')
          .then((response) => {
            this.scorecardConceptScore =
              response.data.assessment_score.conceptScore || []
            resolve(response)
          })
      })
    },
    getQuestionTotal() {
      if (this.hasCategories) {
        const categories = this.categories
        let questions = 0
        Object.keys(categories).forEach((key, index) => {
          questions += categories[key].question_summary.question_count
        })

        return questions
      }

      return 0
    },
    getAnswerCounts(answer) {
      if (this.hasCategories) {
        const categories = this.categories
        let answers = 0

        Object.keys(this.categories).forEach((key, index) => {
          answers += categories[key].question_summary[answer]
        })

        return answers
      }

      return 0
    },
    singleConceptAnswers(index) {
      return this.getConceptAnswers(this.surveyConceptNames[index])
    },
    getConceptAnswers(concept) {
      const answers = []
      const thisConcept = this.conceptScore ? this.conceptScore[concept] : null

      if (thisConcept) {
        let unanswered =
          thisConcept.question_count -
          thisConcept.yes -
          thisConcept.maybe -
          thisConcept.no
        unanswered = unanswered < 0 ? 0 : unanswered

        answers.push(
          thisConcept.yes,
          thisConcept.maybe,
          thisConcept.no,
          unanswered
        )
      }
      return answers
    },
    changeConcept(concept) {
      this.currentTab = concept.replace(/\s+/g, '-').toLowerCase()
    },

    downloadSurveyExcel() {
      const url =
        this.$axios.defaults.baseURL +
        'api/portfolio/survey/' +
        this.mode.module.id +
        '/excel?token=' +
        this.$store.state.authentication.token
      window.open(url, '_blank')
    },
    printCharts() {
      window.print()
    },
  },
}
</script>
