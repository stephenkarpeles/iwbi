<template>
  <div class="flex flex-wrap md:px-10 md:py-5">
    <div class="w-full mb-3">
      <WHeadingsHThree
        heading="Alternatives"
        sub-heading="Choose between Alternative Adherence Path and Equivalency Proposals for the most relevant alternative type for your project."
      />
    </div>
    <div class="w-full mb-3">
      <div
        v-if="currentScreen === 'landing'"
        class="md:grid md:grid-cols-2 gap-4 md:space-y-0 space-y-4 mb-5"
      >
        <div
          v-if="currentTab === 'Alternatives'"
          class="
            flex flex-wrap
            shadow-lg
            border
            rounded-lg
            md:px-5
            px-2
            pt-2
            pb-5
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
          v-if="currentTab === 'Alternatives'"
          class="
            flex flex-wrap
            shadow-lg
            border
            rounded-lg
            md:px-5
            px-2
            pt-2
            pb-5
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
        <div
          v-else
          class="
            flex flex-wrap
            shadow-lg
            border
            rounded-lg
            px-5
            pt-2
            pb-5
            col-span-2
          "
        >
          <WHeadingsHFour heading="Need additional guidance?" />
          <div class="w-full mb-3">
            <p class="text-sm text-gray-500">
              We strive to make our global standard flexible, achievable and
              relevant across many locations and project types throughout the
              world. The v2 pilot utilizes <strong>space types</strong> to
              organize requirements in a more modular way, which allows us to
              provide a unified rating system that can accommodate a variety of
              project types.
            </p>
            <ul class="mt-5 text-sm list-disc pl-5 text-gray-500">
              <li>
                If you encounter any feature / feature part where the
                <strong>requirement threshold</strong> doesn’t clearly address a
                unique space type(s) / occupant type(s) in your project, you can
                request that IWBI provide threshold guidance for the unique
                space type(s) / occupant type(s).
              </li>
              <li>
                If you encounter any features / feature part where the
                <strong>applicability</strong> of the requirement is unclear for
                a unique space type(s) / occupant type(s) within your project,
                you can request that IWBI provide applicability guidance for the
                unique space type(s) / occupant(s) type.
              </li>
            </ul>
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
            <WButtonsBase @click.native="currentScreen = 'guidance-form'">
              Request Guidance
            </WButtonsBase>
            <WLinksBase
              class="w-full"
              link="https://www.wellcertified.com/en/articles/well-tip-streamlined-certification-pathway-unique-projects"
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
        <SharedAapForm ref="aap-form" :key="forceReMount" />
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
        <SharedEpForm ref="ep-form" :key="forceReMount + 1" />
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
        v-if="currentScreen === 'landing' && currentTab === 'Alternatives'"
        class="shadow-lg border rounded-lg"
      >
        <SharedStrategiesList />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    project: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      currentTab: 'Alternatives',
      currentScreen: 'landing',
      forceReMount: 0,
    }
  },
  async mounted() {
    // await this.$store.dispatch('project/getStrategies', {
    //   project_id: this.project.id,
    //   v1_aap: this.project.v1_project,
    //   orderBy: 'id',
    //   order: 'desc',
    // })
  },
}
</script>
