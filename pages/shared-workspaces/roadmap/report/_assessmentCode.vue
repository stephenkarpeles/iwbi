<template>
  <div>
    <section class="bg-primary-700 py-8 px-1 md:pb-0">
      <div class="container">
        <div class="flex flex-col-reverse items-center sm:flex-row">
          <div class="lg:pl-20">
            <h1
              class="
                font-bold
                text-4xl text-center text-primary-50
                leading-10
                sm:text-left
              "
            >
              Your WELL Health-Safety Roadmap
            </h1>
            <p class="text-center sm:text-left pt-9">
              <a
                v-if="!currentUser"
                :href="`/user/login`"
                class="
                  text-center
                  py-3
                  px-14
                  bg-secondary-700
                  leading-6
                  text-primary-50
                "
                >Enroll now</a
              >
              <a
                v-else
                :href="
                  portfolioNumber
                    ? `/shared-workspaces/create/${portfolioNumber}?prelim=0`
                    : '/shared-workspaces/create/landing'
                "
                class="
                  text-center
                  py-3
                  px-14
                  bg-secondary-700
                  leading-6
                  text-primary-50
                "
                >Enroll now</a
              >
            </p>
          </div>
          <div class="flex justify-center items-center w-1/2">
            <img src="/assessment/report-main.png" alt="image house" />
          </div>
        </div>
      </div>
    </section>
    <section class="pt-8 px-3">
      <div class="container">
        <div class="border border-primary-200 shadow-md rounded-lg leading-4">
          <div class="p-4 md:p-8">
            <div
              class="
                flex
                justify-between
                items-center
                mb-4
                pb-4
                text-sm
                leading-4
              "
            >
              <div class="w-1/4 px-1">
                <p class="text-primary-600">Project Name:</p>
                <p class="pt-2 text-opacity-50 text-primary-1000">
                  {{ projectName }}
                </p>
              </div>
              <div class="w-1/4 px-1">
                <p class="text-primary-600">Assessment Type:</p>
                <p class="pt-2 text-opacity-50 text-primary-1000">
                  {{ assessmentType }}
                </p>
              </div>
              <div class="w-1/4 px-1">
                <p class="text-primary-600">Primary Space Type:</p>
                <p class="pt-2 text-opacity-50 text-primary-1000">
                  {{ spaceType }}
                </p>
              </div>
              <div class="text-right w-1/4 px-1">
                <p class="text-primary-600">Approximate Square Footage:</p>
                <p class="pt-2 text-opacity-50 text-primary-1000">
                  {{ approximateSize | formatNumber }} sq. ft.
                </p>
              </div>
            </div>
            <div class="relative h-28 pt-4 mt-16 w-11/12">
              <div class="flex justify-between h-8 mt-4">
                <!-- markers -->
                <div
                  class="
                    h-4
                    -translate-y-full
                    absolute
                    bottom-0
                    flex
                    italic
                    text-gray-500 text-sm
                    transform
                    w-full
                  "
                >
                  <div class="w-4 absolute" :style="`left: 0%`">0</div>
                  <div
                    class="w-4 absolute text-center transform -translate-x-1/2"
                    :style="`left: ${(5.0 / report.totalPoints) * 100.0}%`"
                  >
                    5
                  </div>
                  <div
                    class="w-4 absolute text-center transform -translate-x-1/2"
                    :style="`left: ${(10.0 / report.totalPoints) * 100.0}%`"
                  >
                    10
                  </div>
                  <div
                    class="w-4 absolute text-center transform -translate-x-1/2"
                    :style="`left: ${(15.0 / report.totalPoints) * 100.0}%`"
                  >
                    15
                  </div>
                  <div
                    class="w-4 absolute text-center transform -translate-x-1/2"
                    :style="`left: ${(20.0 / report.totalPoints) * 100.0}%`"
                  >
                    20
                  </div>
                  <div
                    class="
                      w-4
                      absolute
                      relative
                      text-center
                      transform
                      -translate-x-1/2
                    "
                    :style="`left: ${(25.0 / report.totalPoints) * 100.0}%`"
                  >
                    25
                    <div>
                      <div
                        class="
                          -mb-5
                          h-3
                          absolute
                          bottom-0
                          leading-4
                          text-center text-gray-500 text-sm
                          w-56
                          transform
                          -translate-x-1/2
                          italic
                        "
                      >
                        Maximum Achievement Level
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  class="bg-green-900"
                  :style="{ width: report.percentages.blue + '%' }"
                ></div>
                <div
                  class="bg-primary-600"
                  :style="{ width: report.percentages.green + '%' }"
                ></div>
                <div
                  class="bg-primary-400"
                  :style="{ width: report.percentages.yellow + '%' }"
                ></div>
                <div
                  class="bg-secondary-600"
                  :style="{ width: report.percentages.peach + '%' }"
                ></div>
                <div
                  class="bg-secondary-800"
                  :style="{ width: report.percentages.grey + '%' }"
                ></div>
              </div>

              <div
                class="absolute top-0 max-w-xs mt-4"
                :style="{ left: passPercentage + '%' }"
              >
                <div class="flex">
                  <div class="relative">
                    <div
                      class="
                        marker-bot-triangle
                        -translate-x-1/2
                        absolute
                        bottom-0
                        marker-bot-triangle
                        transform
                      "
                    ></div>
                    <div
                      class="
                        -translate-x-1/2
                        absolute
                        top-0
                        mt-1
                        marker-top-triangle
                        transform
                      "
                    ></div>
                    <div
                      class="
                        absolute
                        top-0
                        -mt-14
                        font-bold
                        leading-4
                        text-center text-primary-700 text-sm
                        w-56
                        transform
                        -translate-x-1/2
                      "
                    >
                      <img
                        class="mx-auto w-14"
                        src="/assessment/hsr-seal.png"
                      />
                    </div>
                    <div
                      class="
                        -mb-12
                        absolute
                        bottom-0
                        leading-4
                        text-center text-gray-500 text-sm
                        w-56
                        transform
                        -translate-x-1/2
                        italic
                      "
                    >
                      Minimum Achievement Level
                    </div>
                    <div
                      class="border border-gray-600 h-12 w-0 mt-2"
                      style="margin-left: -1px"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            <div class="pt-16 md:pt-8 text-center sm:text-left">
              <h3 class="text-2xl leading-9 text-primary-900 font-bold mb-3">
                <span v-html="report.texts[0]"> </span>
              </h3>
              <p class="text-lg leading-7 text-primary-900 mb-10">
                <span v-html="report.texts[1]"> </span>
              </p>
              <p class="text-lg leading-7 text-primary-900 mb-8">
                <span v-html="report.texts[2]"> </span>
              </p>
              <p class="text-center sm:text-right mt-3">
                <button
                  v-if="!currentUser"
                  class="
                    font-bold
                    text-secondary-50
                    leading-6
                    py-2
                    px-3
                    bg-primary-600
                    rounded
                  "
                  @click="$router.push('/user/login')"
                >
                  Save Results
                </button>
                <button
                  class="
                    font-bold
                    text-secondary-50
                    leading-6
                    py-2
                    px-3
                    bg-primary-600
                    rounded
                  "
                  @click="downloadReport"
                >
                  Download PDF report
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="px-3">
      <div class="container">
        <div
          v-for="(d, index) in report.r"
          :key="index"
          class="rounded-lg border border-primary-200 mt-8"
        >
          <div class="relative">
            <div
              v-if="hidden[index] && reportRibbon.step === index"
              class="ribbon-small shadow-xl text-white p-1 flex items-center"
            >
              <img
                src="/assessment/hsr-seal.png"
                class="ml-6 w-5"
                alt="HSR Seal"
              />
              <div></div>
              <span class="ml-4 text-sm">Minimum Achievement Level</span>
            </div>
            <div
              class="rounded-t-lg flex justify-between p-12 text-primary-50"
              :class="{ [colors[index]]: true }"
            >
              <div class="w-3/12">
                <p class="leading-5 font-bold mb-2 mr-3">
                  {{ d.heading }}
                </p>
              </div>
              <div
                class="
                  w-9/12
                  flex
                  justify-between
                  items-center
                  max-w-xl
                  lg:max-w-3xl
                  xl:max-w-5xl
                "
              >
                <p class="text-sm leading-4 hidden sm:block">
                  {{ report.texts[descriptions[index]] }}
                </p>
                <div
                  class="flex flex-col pl-5 cursor-pointer w-2/12 text-center"
                  @click="hidden[index] = !hidden[index]"
                >
                  <img
                    class="self-center mb-3 transform"
                    :class="{ 'rotate-180': hidden[index] }"
                    src="/assessment/arrow-down.png"
                    alt="open"
                  />
                  <span class="font-normal text-sm leading-6">
                    {{ hidden[index] ? 'expand' : 'hide' }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="p-3 md:p-8" :class="{ hidden: hidden[index] }">
            <div class="rounded-t-lg text-primary-900 leading-5">
              <div
                class="
                  py-3
                  border
                  bg-primary-200
                  border-primary-300
                  rounded-t-lg
                  px-2
                  md:px-8
                  flex
                  justify-between
                  uppercase
                  items-center
                  text-sm
                "
              >
                <div class="w-5/12 font-bold">Feature</div>
                <div class="w-5/12 font-bold">Core Area</div>
                <div class="w-5/12 font-bold">Documentation You'll Need</div>
                <div class="font-bold w-2/12 sm:w-1/12 text-center">Points</div>
              </div>
              <div class="border-l border-r border-primary-200 text-sm">
                <div v-for="(item, innerIndex) in d.q" :key="innerIndex">
                  <div
                    class="
                      border-b border-primary-200
                      px-2
                      md:px-8
                      py-3
                      flex
                      items-center
                    "
                  >
                    <div class="w-5/12 opacity-50">{{ item.feature }}</div>
                    <div class="w-5/12 opacity-50">{{ item.coreArea }}</div>
                    <div class="w-5/12 opacity-50">
                      {{ item.documentation }}
                    </div>
                    <div class="w-2/12 sm:w-1/12 opacity-50 text-center">
                      {{ item.points }}
                    </div>
                  </div>

                  <div
                    v-if="item.feature === reportRibbon.feature"
                    class="
                      ribbon
                      shadow-2xl
                      border-b border-primary-200
                      text-white
                      px-2
                      md:px-8
                      py-4
                      flex
                      items-center
                      w-full
                    "
                  >
                    <img
                      src="/assessment/hsr-seal.png"
                      class="w-10"
                      alt="HSR Seal"
                    />
                    <span class="ml-4">
                      You need to achieve a minimum of 15 features to earn the
                      WELL Health-Safety Rating. We’ve determined those above
                      this line may be most feasible for you to pursue based on
                      your responses. (Of course, feel free to swap any from
                      below if you prefer.)
                    </span>
                  </div>
                </div>
              </div>
              <div
                class="
                  flex
                  border border-t-0 border-primary-200
                  px-2
                  md:px-8
                  py-3
                "
              >
                <div class="w-full text-right leading-6 font-bold">
                  {{ d.heading }}
                </div>
                <div
                  class="w-2/12 sm:w-1/12 leading-6 font-bold text-center pl-6"
                >
                  {{ d.totalPoints }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <p
          class="
            text-primary-900
            leading-6
            tracking-tighter
            opacity-50
            pt-6
            md:pt8
            text-center
            sm:text-left
          "
        >
          * Note on Innovation Features: The 15 Features required for the WELL
          Health-Safety Rating™ may include up to 3 Innovation Features. This
          report only shows what we believe to be the 3 most easily achieved
          Features for your project; however, you may choose to pursue other
          Features instead, such as an Innovation Proposal or Design for WELL
          Health-Safety (Option 1 or 3 at
          <a
            href="https://v2.wellcertified.com/health-safety/en/innovation/feature/1)."
            >https://v2.wellcertified.com/health-safety/en/innovation/feature/1).</a
          >. We may suggest some of these options already, but there are nearly
          20 different ways to earn this feature, so you may wish to choose
          others.
        </p>
      </div>
    </section>
    <section class="pt-8 px-3">
      <div class="container">
        <div>
          <div
            class="
              md:hover:bg-primary-100
              bg-primary-100
              md:bg-primary-50
              transition-all
              duration-300
              cursor-pointer
              border border-primary-200
              md:border-primary-50 md:hover:border-primary-200
              flex flex-col-reverse
              sm:flex-row
              justify-between
              p-8
              text-center
              sm:text-left
            "
          >
            <div>
              <div class="font-bold text-3xl leading-10 opacity-70 mb-5">
                Take the next step
              </div>
              <p class="leading-6 text-opacity-70 text-primary-1000">
                Enroll now to start your WELL Health-Safety Rating Journey!
              </p>
              <p class="pt-6">
                <a
                  v-if="!currentUser"
                  :href="`/user/login`"
                  class="
                    leading-6
                    py-3
                    px-14
                    border-2 border-primary-600
                    rounded
                    bg-primary-600
                    text-white
                    transition-color
                    duration-300
                  "
                  >Enroll now</a
                >
                <a
                  v-else
                  :href="
                    portfolioNumber
                      ? `/shared-workspaces/create/${portfolioNumber}?prelim=0`
                      : '/shared-workspaces/create/landing'
                  "
                  class="
                    leading-6
                    py-3
                    px-14
                    border-2 border-primary-600
                    rounded
                    bg-primary-600
                    text-white
                    transition-color
                    duration-300
                  "
                  >Enroll now</a
                >
              </p>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div
          class="
            md:bg-primary-100
            transition-all
            duration-300
            border border-primary-200
            md:border-primary-200
            flex flex-col-reverse
            sm:flex-row
            justify-between
            p-8
            my-4
            text-center
            sm:text-left
          "
        >
          <div>
            <div class="font-bold text-3xl leading-10 opacity-70 mb-5">
              Learn More
            </div>
            <p class="leading-6 text-opacity-70 text-primary-1000">
              Find out the cost of earning the WELL Health-Safety Seal for your
              building, tenant space, or portfolio.
            </p>
            <p class="pt-6">
              <a
                :href="'/shared-workspaces/estimator/create'"
                class="
                  leading-6
                  text-primary-600
                  py-3
                  px-14
                  border-2 border-primary-600
                  rounded
                  md:hover:bg-primary-600 md:hover:text-primary-50
                  transition-color
                  duration-300
                "
              >
                Get a pricing estimate
              </a>
            </p>
          </div>
        </div>
        <div
          class="
            md:hover:bg-primary-100
            bg-primary-100
            md:bg-primary-50
            transition-all
            duration-300
            cursor-pointer
            border border-primary-200
            md:border-primary-50 md:hover:border-primary-200
            flex flex-col-reverse
            sm:flex-row
            justify-between
            p-8
            text-center
            sm:text-left
          "
        >
          <div>
            <div class="font-bold text-3xl leading-10 opacity-70 mb-5">
              Questions?
            </div>
            <p class="leading-6 text-opacity-70 text-primary-1000">
              Contact us and our support team will get in touch with you.
            </p>
            <p class="pt-6">
              <a
                href="mailto:healthsafety@wellcertified.com"
                class="
                  leading-6
                  py-3
                  px-14
                  border-2 border-primary-600
                  rounded
                  bg-primary-600
                  text-white
                  transition-color
                  duration-300
                "
              >
                Contact us
              </a>
            </p>
          </div>
        </div>
      </div>
      <div>
        <p class="mt-5 mb-3 text-gray-400 text-normal text-justify">
          Please note that this survey does not replace any portion of the WELL
          Health-Safety Rating process, and the results of this survey do not
          guarantee achievement of the rating or any requirements within the
          rating; rather, it’s meant to be a tool to help you learn about the
          WELL Health-Safety Rating requirements and to assess your current
          project or projects. This survey and assessment report is for your
          internal, informational purposes only, is based on inputs provided by
          you in order to assist you on your journey to pursue the WELL
          Health-Safety Rating, and IWBI shall not be liable or responsible for
          any action or inaction taken in reliance on this survey. By using this
          survey and any tool on this website, you agree to our website
          <a
            href="https://www.wellcertified.com/terms"
            class="text-primary-700"
            target="_blank"
            >Terms of Use</a
          >
          and
          <a
            href="https://www.wellcertified.com/privacy"
            class="text-primary-700"
            target="_blank"
            >Privacy Policy</a
          >.
        </p>
        <p class="mt-5 mb-3 text-gray-400 text-normal text-justify">
          International WELL Building Institute, IWBI, the WELL Building
          Standard, WELL v2, WELL Certified, WELL AP, WELL Portfolio, WELL
          Portfolio Score, The WELL Conference, We Are WELL, the WELL Community
          Standard, WELL Health-Safety Rating, WELL Health-Safety Rated, WELL
          Workforce, WELL and others, and their related logos are trademarks or
          certification marks of International WELL Building Institute pbc in
          the United States and other countries.
        </p>
        <p class="mt-5 mb-3 text-gray-400 text-normal text-justify">
          © 2021 International WELL Building Institute pbc. All rights reserved.
        </p>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  auth: false,
  asyncData({ params }) {
    const slug = params.assessmentCode
    return { slug }
  },
  data() {
    return {
      colors: {
        Guaranteed: 'bg-green-900',
        Green: 'bg-primary-600',
        Yellow: 'bg-primary-400',
        Red: 'bg-secondary-600',
        Black: 'bg-secondary-800',
      },
      descriptions: {
        Guaranteed: 4,
        Green: 5,
        Yellow: 6,
        Red: 7,
        Black: 8,
      },
      hidden: {
        Guaranteed: false,
        Green: false,
        Yellow: false,
        Red: false,
        Black: false,
      },
    }
  },
  computed: {
    ...mapState({
      currentUser: (state) => state.user.currentUser,
      completed: (state) => state.assessment.completed,
      report: (state) => state.assessment.report,
      pdfLink: (state) => state.assessment.pdfLink,
      projectName: (state) => state.assessment.projectName,
      approximateSize: (state) => state.assessment.approximateSize,
      spaceType: (state) => state.assessment.spaceType,
      assessmentType: (state) => state.assessment.assessmentType,
      portfolioNumber: (state) => state.assessment.portfolioNumber,
      reportRibbon: (state) => state.assessment.reportRibbon,
    }),
    currentPoints() {
      let count = 0
      for (const e of Object.values(this.report.r)) {
        count += e.totalPoints
      }

      return count
    },
    passPercentage() {
      if (this.report && this.report.totalPoints) {
        return (15.0 * 100.0) / this.report.totalPoints
      }
      return 0
    },
  },
  async mounted() {
    await this.$store.dispatch('assessment/getForm', this.slug)

    if (!this.completed) {
      this.$router.replace(`/shared-workspaces/roadmap/${this.slug}`)
    }
  },
  methods: {
    async downloadReport() {
      await this.$store.dispatch('assessment/getPdf', this.slug)
      window.open(this.pdfLink, '_blank')
    },
  },
}
</script>

<style scoped>
.ribbon {
  background-color: #e2c185;
  margin-left: -20px;
  width: 103%;
  position: relative;
}
.ribbon:after {
  border: 0 solid #0000;
  border-top-color: #bebebe;
  border-width: 14px 0 0 20px;
  content: '';
  height: 0;
  left: 0;
  position: absolute;
  top: 100%;
  width: 0;
}
.ribbon-small {
  position: absolute;
  background-color: #e2c185;
  margin-left: -15px;
  width: 25%;
  top: 8px;
}
.ribbon-small:after {
  border: 0 solid #0000;
  border-top-color: #bebebe;
  border-width: 14px 0 0 15px;
  content: '';
  height: 0;
  left: 0;
  position: absolute;
  top: 100%;
  width: 0;
}
.marker-bot-triangle {
  width: 0;
  height: 0;
  border-bottom: 10px solid #475766;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
}

.marker-top-triangle {
  width: 0;
  height: 0;
  border-top: 10px solid #475766;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
}
</style>
