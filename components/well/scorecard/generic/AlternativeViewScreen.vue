<template>
  <div>
    <div class="w-full">
      <WTabsHorizontal
        ref="tabs"
        v-model="currentTab"
        class="px-5"
        :tabs="[{ name: 'Alternatives' }, { name: 'Strategies' }]"
      />
    </div>
    <div v-if="currentTab === 'Alternatives'" class="px-2">
      <div>
        <p class="text-sm leading-5 py-5">
          IWBI welcomes projects to meet feature requirements through
          innovative, alternatives, which can be proposed through an alternative
          adherence path (AAP) submission. An AAP or Equivalency Proposal is a
          formal request for approval and technical guidance to use an
          alternative or equivalent strategy to comply with a specific feature
          and the feature intent.
          <b
            >These proposals undergo review to ensure that the alternate pathway
            is aligned with the WELL feature and health intent.</b
          >
        </p>
        <div class="mb-5">
          <div class="flex justify-between border shadow p-5 rounded">
            <div class="w-1/5 flex">
              <div class="flex items-center">
                <img
                  src="/alternative/aap-d.png"
                  alt="AAP"
                  class="bg-gray-500 rounded-full h-12 w-12 flex items-center"
                />
              </div>
            </div>
            <div class="w-4/5">
              <WHeadingsHFour
                :heading="'Alternative Adherence Path Proposals (AAPs)'"
              />
              <p class="mb-5 leading-5 text-sm">
                An AAP is appropriate for projects with a unique, nuanced or
                complex element that restricts their ability to comply with
                existing feature requirements.
              </p>
              <div class="flex">
                <div v-if="!isProjectImported">
                  <WButtonsBase
                    v-if="project.project_phase !== 'assessment'"
                    type="primaryInverted"
                  >
                    Submit AAP
                  </WButtonsBase>
                  <WLinksBase
                    type="navPrimary"
                    link="https://www.wellcertified.com/en/articles/well-tip-how-craft-successful-alternative-adherence-path-aap"
                    icon="plus"
                    target="_blank"
                  >
                    Learn More
                  </WLinksBase>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="mb-5">
          <div class="flex justify-between border shadow p-5 rounded">
            <div class="flex w-1/5">
              <div class="flex items-center">
                <img
                  src="/alternative/ep-d.png"
                  alt="AAP"
                  class="bg-gray-500 rounded-full h-12 w-12 flex items-center"
                />
              </div>
            </div>
            <div class="w-4/5">
              <WHeadingsHFour :heading="'Equivalency Proposals (EPs)'" />
              <p class="mb-5 leading-5 text-sm">
                An EP is appropriate for projects that seek to substitute an
                equivalent standard, code or practice in place of WELL feature
                requirements. This is often most relevant to projects outside of
                the United States where local regulations and standards differ
                from those currently approved for use.
              </p>
              <div class="flex">
                <div v-if="!isProjectImported">
                  <WButtonsBase
                    v-if="project.project_phase !== 'assessment'"
                    type="primaryInverted"
                  >
                    Submit AAP
                  </WButtonsBase>
                  <WLinksBase
                    type="navPrimary"
                    link="https://www.wellcertified.com/en/articles/well-tip-your-step-step-guide-submitting-equivalencies"
                    icon="plus"
                    target="_blank"
                  >
                    Learn More
                  </WLinksBase>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="mb-5">
          <div class="flex justify-between border shadow p-5 rounded">
            <div class="flex w-1/5">
              <div class="flex items-center">
                <img
                  src="/alternative/support-d.png"
                  alt="AAP"
                  class="bg-gray-500 rounded-full h-12 w-12 flex items-center"
                />
              </div>
            </div>
            <div class="w-4/5">
              <WHeadingsHFour :heading="'Need additional guidance?'" />
              <p class="mb-5 leading-5 text-sm">
                We strive to make our global standard flexible, achievable and
                relevant across many locations and project types throughout the
                world. The v2 pilot utilizes <strong>space types</strong> to
                organize requirements in a more modular way, which allows us to
                provide a unified rating system that can accommodate a variety
                of project types.
              </p>
              <ul class="mb-5 text-sm">
                <li>
                  If you encounter any feature / feature part where the
                  <strong>requirement threshold</strong> doesn’t clearly address
                  a unique space type(s) / occupant type(s) in your project, you
                  can request that IWBI provide threshold guidance for the
                  unique space type(s) / occupant type(s).
                </li>
                <li>
                  If you encounter any features / feature part where the
                  <strong>applicability</strong> of the requirement is unclear
                  for a unique space type(s) / occupant type(s) within your
                  project, you can request that IWBI provide applicability
                  guidance for the unique space type(s) / occupant(s) type.
                </li>
              </ul>

              <div>
                <div
                  v-if="
                    (project.project_phase !== 'assessment' &&
                      !isProjectImported) ||
                    portfolioAdminAccess
                  "
                  class="flex"
                >
                  <div class="mr-4">
                    <WButtonsBase
                      v-if="
                        project.project_phase !== 'assessment' ||
                        portfolioAdminAccess
                      "
                      type="primaryInverted"
                    >
                      Request Guidance
                    </WButtonsBase>
                  </div>
                  <WLinksBase
                    type="navPrimary"
                    link="https://www.wellcertified.com/en/articles/well-tip-streamlined-certification-pathway-unique-projects"
                    icon="plus"
                    target="_blank"
                  >
                    Learn More
                  </WLinksBase>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="currentTab === 'Strategies'" class="px-2"></div>
  </div>
</template>
<script>
import { mapGetters, mapState } from 'vuex'
export default {
  props: {
    part: {
      type: Object,
      required: true,
    },
    project: {
      type: Object,
      required: true,
    },
    subPart: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      currentTab: 'Alternatives',
    }
  },
  computed: {
    ...mapGetters('user', ['portfolioAdminAccess']),
    ...mapState({
      currentUser: (state) => state.user.currentUser,
      scorecard: (state) => state.scorecard.scorecard,
      adminReviewResponses: (state) => state.scorecard.adminReviewResponses,
    }),

    isProjectImported() {
      if (
        this.project.type === 'v2-pilot-upgraded' ||
        this.project.type === 'v1-upgraded'
      ) {
        return true
      } else {
        return false
      }
    },
  },
}
</script>
