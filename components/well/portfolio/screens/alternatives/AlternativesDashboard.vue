<template>
  <div class="flex flex-wrap md:px-10 md:py-5">
    <div class="w-full mb-3">
      <WHeadingsHThree
        heading="Alternatives"
        sub-heading="Choose between Alternative Adherence Path and Equivalency Proposals for the most relevant alternative type for your project."
      />
    </div>
    <!-- Cards -->
    <div class="w-full mb-3">
      <div
        v-if="currentScreen === 'landing'"
        class="md:grid md:grid-cols-2 gap-4 md:space-y-0 space-y-4 mb-5"
      >
        <div
          class="
            shadow-lg
            border
            rounded-lg
            md:px-5
            px-2
            pt-2
            pb-5
            flex flex-wrap
          "
        >
          <WHeadingsHFour
            heading="Alternative Adherence Path Proposals (AAPs)"
          />
          <div class="w-full mb-3">
            <p class="text-sm text-gray-500">
              An AAP is appropriate for projects with a unique, nuanced or
              complex element that restricts their ability to comply with
              existing feature requirements.
            </p>
          </div>
          <div
            class="
              w-full
              mt-auto
              flex flex-col
              md:flex-row md:space-y-0
              space-y-2
              md:space-x-2
              w-80
            "
          >
            <WButtonsBase @click.native="currentScreen = 'aap-form'">
              Submit AAP
            </WButtonsBase>
            <WLinksBase
              class="w-full"
              link="https://well.support/2e056cb4-f52d-4295-bd5a-07b73c068b0a"
              target="_blank"
            >
              <WButtonsBase type="primaryInverted" icon="plus">
                Learn More
              </WButtonsBase>
            </WLinksBase>
          </div>
        </div>
        <div
          class="
            shadow-lg
            border
            rounded-lg
            md:px-5
            px-2
            pt-2
            pb-5
            flex flex-wrap
          "
        >
          <WHeadingsHFour heading="Equivalency Proposals (EPs)" />
          <div class="w-full mb-3">
            <p class="text-sm text-gray-500">
              An EP is appropriate for projects that seek to substitute an
              equivalent standard, code or practice in place of WELL feature
              requirements. This is often most relevant to projects outside of
              the United States where local regulations and standards differ
              from those currently approved for use.
            </p>
          </div>
          <div
            class="
              w-full
              mt-auto
              flex flex-col
              md:flex-row md:space-y-0
              space-y-2
              md:space-x-2
              w-80
            "
          >
            <WButtonsBase @click.native="currentScreen = 'ep-form'">
              Submit EP
            </WButtonsBase>
            <WLinksBase
              class="w-full"
              link="https://well.support/549214f4-9a41-4008-b4d1-ecf581bfd872"
              target="_blank"
            >
              <WButtonsBase type="primaryInverted" icon="plus">
                Learn More
              </WButtonsBase>
            </WLinksBase>
          </div>
        </div>
      </div>
      <div
        v-if="currentScreen === 'aap-form'"
        class="shadow-lg border rounded-lg p-5"
      >
        <WLinksBase
          link="#"
          icon="arrow-narrow-left"
          @click.native="currentScreen = 'landing'"
        >
          Back to Alternatives
        </WLinksBase>
        <PortfolioAapForm
          v-if="portfolio.type !== 'v1'"
          ref="aap-form"
          :key="forceReMount"
        />
        <ProjectV1AapForm v-else ref="aap-form" :key="forceReMount" />
      </div>
      <div
        v-if="currentScreen === 'ep-form'"
        class="shadow-lg border rounded-lg p-5"
      >
        <WLinksBase
          link="#"
          icon="arrow-narrow-left"
          @click.native="currentScreen = 'landing'"
        >
          Back to Alternatives
        </WLinksBase>
        <PortfolioEpForm
          v-if="portfolio.type !== 'v1'"
          ref="ep-form"
          :key="forceReMount + 1"
        />
        <ProjectV1EpForm v-else ref="ep-form" :key="forceReMount + 1" />
      </div>
      <div
        v-if="currentScreen === 'guidance-form'"
        class="shadow-lg border rounded-lg p-5"
      >
        <WLinksBase
          link="#"
          icon="arrow-narrow-left"
          @click.native="currentScreen = 'landing'"
        >
          Back
        </WLinksBase>
      </div>
      <div
        v-if="currentScreen === 'landing'"
        class="shadow-lg border rounded-lg"
      >
        <PortfolioStrategiesList v-if="portfolio" :id="portfolio.id" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      currentScreen: 'landing',
      forceReMount: 0,
    }
  },
  computed: {
    ...mapState({
      portfolio: (state) => state.portfolio.portfolio,
    }),
  },
  mounted() {
    this.$store.commit('settings/setSidebarTab', 'Alternatives')
  },
}
</script>
