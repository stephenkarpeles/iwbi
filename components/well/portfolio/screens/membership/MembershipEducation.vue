<template>
  <div class="p-10">
    <!-- Modals -->
    <WFeedbackModal ref="modal" class="ml-0">
      <iframe
        src="https://tellingwellstory.wellcertified.com"
        class="w-full"
        style="height: 70vh; width: 40vw"
      ></iframe>
    </WFeedbackModal>
    <!-- Header Section -->
    <div class="text-center">
      <WHeadingsHOne class="text-primary-900" heading="MEMBER EDUCATION" />
      <WHeadingsHTwo class="text-primary-500 my-4" heading="tool kit" />
    </div>
    <!-- CTA 1 -->
    <div class="text-primary-900 mt-12">
      <div class="text-center">
        <WHeadingsHTwo heading="Become a WELL AP" />
        <span class="text-base opacity-50"
          >Become a member of the WELL AP community and advance your career.
          Members receive a 30% discount on WELL AP exam products.
        </span>
      </div>
      <div class="flex justify-center space-x-4 mt-6">
        <div
          class="
            flex flex-col
            rounded-md
            shadow-md
            border border-primary-300
            p-5
          "
        >
          <span class="text-lg">Self-guided bundle </span>
          <ul class="list-inside">
            <li>
              <Flyout ref="conceptFlyout" y="bottom" x="right" class="h-full">
                <WButtonsBase type="tooltip" icon="question-mark-circle" />
                <template #content>
                  <div class="p-3 w-64">
                    An exam designed to test general knowledge of the WELL
                    Building Standard™ and strategies to advance human health
                    and wellness in buildings across the globe.
                  </div>
                </template>
              </Flyout>
              <span class="opacity-50"> WELL AP exam registration </span>
            </li>
            <li>
              <Flyout ref="conceptFlyout" y="bottom" x="right" class="h-full">
                <WButtonsBase type="tooltip" icon="question-mark-circle" />
                <template #content>
                  <div class="p-3 w-64">
                    A comprehensive electronic webBook including a suite of
                    digital learner resources that provide a thorough review of
                    the principles and content within the WELL Building
                    Standard™.
                  </div>
                </template>
              </Flyout>
              <span class="opacity-50"> ATP exam prep webBook</span>
            </li>
            <li>
              <Flyout ref="conceptFlyout" y="bottom" x="right" class="h-full">
                <WButtonsBase type="tooltip" icon="question-mark-circle" />
                <template #content>
                  <div class="p-3 w-64">
                    A self-paced, interactive, end-to-end, digital exam
                    preparation module including over 30 study sessions.
                  </div>
                </template>
              </Flyout>
              <span class="opacity-50"> Exam preparation study plan</span>
            </li>
          </ul>
        </div>
        <div
          class="
            flex flex-col
            rounded-md
            shadow-md
            border border-primary-300
            p-5
          "
        >
          <span class="text-lg">WELL AP Exam only</span>
          <ul class="list-inside">
            <li>
              <Flyout ref="conceptFlyout" y="bottom" x="right" class="h-full">
                <WButtonsBase type="tooltip" icon="question-mark-circle" />
                <template #content>
                  <div class="p-3 w-64">
                    An exam designed to test general knowledge of the WELL
                    Building Standard™ and strategies to advance human health
                    and wellness in buildings across the globe.
                  </div>
                </template>
              </Flyout>
              <span class="opacity-50"> WELL AP exam registration</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="mt-4 flex justify-center">
        <a
          class="bg-primary-500 text-white p-4 rounded-md text-lg"
          href="https://www.wellcertified.com/well-ap/"
          target="_blank"
          >GET STARTED</a
        >
      </div>
    </div>
    <!-- CTA 2 -->
    <div class="mt-8 text-primary-900">
      <div class="text-center">
        <WHeadingsHTwo heading="Keep learning" />
        <span class="text-base opacity-50 mx-14"
          >Advance your career and keep learning with your curated education
          resources.
        </span>
      </div>
      <div class="grid grid-cols-2 gap-4 mt-4 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="(card, index) in keepLearningCards"
          :key="index"
          class="
            flex flex-col
            border border-primary-300
            rounded-lg
            relative
            shadow-md
            cursor-pointer
          "
          @click="openCardLink(card)"
        >
          <img
            class="rounded-t-md"
            :src="$config.assetsURL + card.imageUrl"
            alt=""
          />
          <div id="content" class="flex flex-col p-4">
            <span class="uppercase text-sm text-secondary-700">resources</span>
            <span class="text-xl my-1 text-primary-800">{{ card.title }}</span>
            <span class="text-primary-900 opacity-50 text-base">{{
              card.description
            }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- CTA 3 -->
    <div class="mt-12 text-primary-900">
      <div class="text-center">
        <WHeadingsHTwo heading="Educational Resources" />
        <span class="text-base opacity-50 mx-14"
          >Access this exclusive library of education resources to stay up to
          speed on all things WELL.
        </span>
      </div>
      <div class="grid grid-cols-2 gap-4 mt-4 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="(card, index) in educationalResourcesCards"
          :key="index"
          class="
            flex flex-col
            border border-primary-300
            rounded-lg
            relative
            shadow-md
            cursor-pointer
          "
          @click="openCardLink(card.link)"
        >
          <img
            class="rounded-t-md"
            :src="$config.assetsURL + card.imageUrl"
            alt=""
          />
          <div id="content" class="flex flex-col p-4">
            <span class="uppercase text-sm text-secondary-700">resources</span>
            <span class="text-xl my-1 text-primary-800">{{ card.title }}</span>
            <span class="text-primary-900 opacity-50 text-base">{{
              card.description
            }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      keepLearningCards: [
        {
          title: 'WELL AP Exam Study Plan',
          description:
            'An interactive, online course that helps learners track their study progress.',
          link: 'https://account.wellcertified.com/education-courses/studyplan',
          imageUrl:
            'portfolio/screen/membership/education_tab/Resource-STUDY-PLAN.png',
        },
        {
          title: 'Education sessions',
          description:
            'Access this exclusive library of education resources to earn up to ten WELL-specific CEU’s (Continuing Education Credits).',
          link: 'https://resources.wellcertified.com/resources?type=webcasts&tags=resource%20type%2FGeneral%20CE',
          imageUrl:
            'portfolio/screen/membership/education_tab/Resource-Template-Webcast.png',
        },
        {
          title: 'Telling the WELL Story',
          description:
            'This four-module course will help you prepare a compelling and custom narrative to communicate about WELL with simplicity, clarity and meaning.',
          link: '',
          imageUrl:
            'portfolio/screen/membership/education_tab/Stocksy_txp71de71243fP200_Medium_1651510.jpeg',
          isIframe: true,
          // need iframe link
        },
        {
          title: 'Ergonomics at home: Setting yourself up for success',
          description:
            'This members-only presentation from IWBI’s Angela Spangler, a trained ergonomist, teaches strategies for creating a healthy and productive work-from-home set up or environment.',
          link: 'https://us02web.zoom.us/rec/share/6dwnK0RK20IOIKBY97y3sZGopXQVTq3wh1xdGRWQYObzSWStc0_o5zVhQ_4VUcQ.gODNtUijbMOakvkx?startTime=1588194031000',
          imageUrl:
            'portfolio/screen/membership/education_tab/Resource-Template-Webcast.png',
        },
        {
          title: 'Connecting wellness strategies to research',
          description:
            'This members-only presentation from IWBI’s Senior Vice President of Research, Dr. Whitney Austin Gray, educates viewers on how to leverage evidence-based strategies and cutting-edge research to support the needs of their clients and customers following the COVID-19 pandemic.',
          link: 'https://us02web.zoom.us/rec/share/UNiZe1MqQyKsplkZvTvGiH0WwLA_3zvVv9ZgcwoiiEQ1WtGyq-XLN3EX0lIZfuHu.k1M9I0AAiVLZUEHP?startTime=1588701653000',
          imageUrl:
            'portfolio/screen/membership/education_tab/events-webcast-generic-1.png',
        },
        {
          title: '2020 IWBI Member Meeting',
          description:
            'During our inaugural member meeting, hear from the IWBI team about what’s been happening at IWBI and key updates in the days and months ahead.',
          link: 'https://us02web.zoom.us/rec/share/ZWcbUzN7N9Ty7cZCwPCz5Z4J7vcs5AbXwgUU3PafSmOK5SAAakI0Tyc5hxopbP8.F5U4w2T-u-PzRJza?startTime=1600272045000',
          imageUrl:
            'portfolio/screen/membership/education_tab/annual-member-meeting.png',
        },
      ],
      educationalResourcesCards: [
        {
          title: 'WELL Country Briefs',
          description:
            'The WELL country briefs connect national health data to strategies for enhancing health and well-being in buildings and communities around the world. We created linkages only if there was available data in the Global Burden of Disease database from the Institute of Health Metrics and Evaluation (IHME) at the University of Washington.',
          link: 'https://www.wellcertified.com/certification/v2/country-briefs',
          imageUrl:
            'portfolio/screen/membership/education_tab/WELL-CountryBriefs.png',
        },
        {
          title: 'The Business Case for Health and Wellbeing in Green Building',
          description:
            'This report explores the dual opportunity to do right by the planet and people by showcasing pioneering green building projects that are leading the way in being resource efficient and providing healthy, productive spaces for their occupants and significant returns for their owners and investors.',
          link: 'https://www.worldgbc.org/sites/default/files/WorldGBC%20-%20Doing%20Right%20by%20Planet%20and%20People%20-%20April%202018_0.pdf',
          imageUrl:
            'portfolio/screen/membership/education_tab/TheBusinessCaseforHealthinGreenBuildings.png',
        },
        {
          title: 'ASID Report: Design in the Workplace',
          description:
            'ASID completed a full spectrum of pre- and post-occupancy research on its new Washington, D.C. headquarters. The research shows how workplace design positively influences health, wellness, employee satisfaction, and work performance.',
          link: 'https://www.asid.org/news/asid-releases-comprehensive-research-study-on-the-impact-of-design-in-the-workplace',
          imageUrl: 'portfolio/screen/membership/education_tab/ASID-Report.png',
        },
        {
          title: 'A surprising way to cut real estate costs',
          description:
            'A holistic view of your real estate considers both the hard costs like rent and utilities as well as their residual impact on the people who work there.',
          link: 'https://www.us.jll.com/en/trends-and-insights/workplace/a-surprising-way-to-cut-real-estate-costs',
          imageUrl:
            'portfolio/screen/membership/education_tab/SurprisingwaytoCUTREALESTATECOSTS.png',
        },
        {
          title: 'Crosswalks and Alignments',
          description:
            'Crosswalks are intended to identify synergies between WELL and other green or sensor-related building standards, and streamline efforts for projects seeking a dual rating by acknowledging where WELL Building Standard requirements are deemed equivalent and aligned with aspects of the alternate building rating tool.',
          link: 'https://standard.wellcertified.com/well-crosswalks',
          imageUrl:
            'portfolio/screen/membership/education_tab/Crosswalks-SocialPost-v2.png',
        },
      ],
    }
  },
  methods: {
    openCardLink(card) {
      if (card.link) {
        window.open(card.link, '_blank')
      } else if (card.isIframe) {
        this.$refs.modal.isHidden = false
      }
    },
  },
}
</script>

<style></style>
