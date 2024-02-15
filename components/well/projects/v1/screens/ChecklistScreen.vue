<template>
  <div class="w-full py-5 px-10">
    <WSlideoversOverlay
      ref="checklistSlideover"
      title="Project Checklist"
      class="z-50 w-full"
    >
      <template #content>
        <iframe
          id="project_scorecard"
          :src="iframeSrc"
          frameborder="0"
          class="w-full h-full"
        ></iframe>
      </template>
      <template #headerActions>
        <div class="divide-x divide-white">
          <a
            v-if="
              currentUser.role.includes('well-admin') ||
              currentUser.role.includes('well-assessor') ||
              currentUser.role.includes('external-reviewer')
            "
            class="text-primary-300 text-sm font-light px-1"
            target="_blank"
            :href="`${checklistUrl}/projects/${projectId}/scorecard/review/pdfNotes?token=${authToken}`"
            >Notes</a
          >
          <a
            class="text-primary-300 text-sm font-light px-1"
            target="_blank"
            :href="`${checklistUrl}/projects/${projectId}/scorecard/review?token=${authToken}`"
          >
            Report</a
          >
          <a
            class="text-primary-300 text-sm font-light px-1"
            target="_blank"
            :href="`${checklistUrl}/projects/${projectId}/scorecard?token=${authToken}`"
          >
            Checklist
          </a>
          <a
            v-if="
              currentUser.role.includes('well-admin') ||
              currentUser.role.includes('well-assessor') ||
              currentUser.role.includes('external-reviewer')
            "
            class="text-primary-300 text-sm font-light px-1"
            target="_blank"
            :href="`${checklistUrl}/projects/${projectId}/scorecard/review/admin?token=${authToken}`"
          >
            Review
          </a>
        </div>
      </template>
    </WSlideoversOverlay>
    <div class="w-full flex flex-wrap">
      <div class="mb-3">
        <WHeadingsHThree heading="Project Checklist" />
      </div>
      <div class="w-full flex">
        <div class="w-2/3 text-md text-gray-600 font-light space-y-2 pr-8">
          <p>
            Your team can track its progress towards WELL Certification using a
            project checklist. Invite team members to the project profile to
            begin collaborating today! The checklist can help to:
          </p>
          <ul class="list-disc pl-5">
            <li>Discuss feasibility of achievement</li>
            <li>Track implementation status</li>
            <li>Log notes among team members</li>
            <li>
              Filter requirements by team member responsible, method or
              applicability
            </li>
            <li>Present a summary report of progress</li>
          </ul>
          <p>Click on “Your Checklist” to get started.</p>
        </div>
        <div class="w-1/3">
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="px-4 py-5 sm:px-6 text-primary-700 text-lg">
              <WLinksBase
                href="#"
                @click.native="$refs.checklistSlideover.toggleOpen()"
                >Access your checklist</WLinksBase
              >
            </div>
            <div class="bg-gray-50 px-4 py-5 sm:p-6 text-sm text-gray-400">
              *Use of the checklist, templates or other resources is at your own
              discretion, is based on your own inputs, and does not guarantee
              WELL Certification.
            </div>
          </div>
        </div>
      </div>
      <div class="w-full">
        <WHeadingsHTwo heading="Instructions" class="py-3" />
      </div>
      <div class="w-full flex">
        <div class="w-2/3 text-md text-gray-600 font-light space-y-2 pr-8">
          <WHeadingsHFour heading="Feature Achievement" />
          <hr class="py-1 border-secondary-300" />
          <p>
            The WELL Building Standard is organized into 7
            <strong><i>concepts</i></strong
            >: air, water, nourishment, light, fitness, comfort and mind. The 7
            concepts contain 105 <strong><i>features</i></strong
            >: that a project can implement to achieve its certification goals.
            WELL features are classified as either required
            <strong><i>preconditions</i></strong> or elective
            <strong><i>optimizations</i></strong
            >.
          </p>
          <ul class="list-disc pl-5">
            <li>
              All applicable preconditions must be met to achieve WELL
              Certification at the <strong><i>Silver</i></strong> level.
            </li>
            <li>
              Optimizations are not required, but create a flexible pathway
              towards <strong><i>Gold</i></strong> and
              <strong><i>Platinum</i></strong> level certification.
            </li>
            <li>
              To achieve a feature, all of its applicable parts must be
              satisfied.
            </li>
          </ul>
          <p>
            Learn more about scoring
            <a
              href="https://standard.wellcertified.com/scoring"
              class="text-primary-600"
              target="_blank"
              >here</a
            >.
          </p>
        </div>
        <div class="w-1/3">
          <img
            src="https://cdn.wellcertified.com/static/images/pre-opt-image.png"
            class="img img-fluid px-2 mt-10"
          />
        </div>
      </div>
      <div class="w-full flex pt-5">
        <div class="w-2/3 text-md text-gray-600 font-light space-y-2 pr-8">
          <WHeadingsHFour heading="Feature Verification" />
          <hr class="py-1 border-secondary-300" />
          <p>
            Features can be either
            <strong><i>performance-based standards</i></strong> that allow
            flexibility in how a project meets acceptable thresholds, or
            <strong><i>prescriptive standards</i></strong> that require specific
            technologies, design alternatives or protocols to be implemented.
            Projects have these alternatives reviewed in order to verify they’ve
            been successfully achieved.
          </p>
          <ul class="list-disc pl-5">
            <li>
              Some features will be verified by submitting a type of
              <strong><i>documentation</i></strong
              >: either a copy of a policy, operations schedule, or annotated
              floor plan, etc.
            </li>
            <li>
              Some features will be verified by a specific professional, such as
              an architect or engineer, and attested to using the
              <strong><i>Letter of Assurance</i></strong> template.
            </li>
            <li>
              Some features will be visually inspected or tested onsite by a
              third-party WELL Assessor during
              <strong><i>Performance Verification</i></strong
              >.
            </li>
          </ul>
          <p>
            Learn more about verification types
            <a
              href="https://standard.wellcertified.com/feature-types"
              target="_blank"
              class="text-primary-600"
              >here</a
            >.
          </p>
        </div>
        <div class="w-1/3">
          <img
            src="https://cdn.wellcertified.com/static/images/feature-req.png"
            class="img img-fluid px-2 mt-10"
          />
        </div>
      </div>
      <div class="w-full flex pt-5">
        <div class="w-2/3 text-md text-gray-600 font-light space-y-2 pr-8">
          <WHeadingsHFour heading="Feature Implementation" />
          <hr class="py-1 border-secondary-300" />
          <p>
            Project team members work together to review and implement WELL
            features, by comparing the requirements to existing design,
            operations and policies. Some features necessitate coordination
            among a variety of disciplines, both internal and external to the
            project. The <strong><i>feature method</i></strong> and
            <strong><i>responsible party</i></strong> can help clarify who will
            help to ensure its achievement.
          </p>
          <ul class="list-disc pl-5">
            <li>
              Feature methods can be classified as
              <strong><i>design, performance</i></strong> or
              <strong><i>protocol</i></strong
              >. This filter can provide insight on the order you might
              prioritize your review if your project is under construction.
            </li>
            <li>
              Responsible parties can also vary depending on whether the project
              is under construction or is an existing space.
              <strong><i>Owner, architect, engineer,</i></strong> and
              <strong><i>contractor</i></strong> are the most common roles, but
              contributions can also come from lighting designers, acousticians,
              human resources professionals, facilities managers, food service
              vendors, or cleaning companies.
            </li>
          </ul>
          <p>
            Learn more about project roles
            <a
              href="https://resources.wellcertified.com/tools/well-certification-guidebook/"
              target="_blank"
              class="text-primary-600"
              >here</a
            >.
          </p>
        </div>
        <div class="w-1/3">
          <img
            src="https://cdn.wellcertified.com/static/images/feature-imp.png"
            class="img img-fluid px-2 mt-10"
          />
        </div>
      </div>
      <div class="w-full flex pt-5">
        <div class="w-2/3 text-md text-gray-600 font-light space-y-2 pr-8">
          <WHeadingsHFour heading="Feature Flexibility" />
          <hr class="py-1 border-secondary-300" />
          <p>
            WELL offers a project flexibility on how they meet the
            <strong><i>intent</i></strong> of features, especially useful to
            accommodate the various building practices around the world.
            Existing spaces also benefit from this flexibility where there are
            constraints to easily implementing a feature.
          </p>
          <ul class="list-disc pl-5">
            <li>
              When a project cannot meet a feature requirement as written,
              projects can review published
              <strong><i>alternate adherence paths (AAPs)</i></strong> or can
              propose new alternatives for meeting the intent of WELL features.
            </li>
            <li>
              WELL also encourages flexibility through approving
              <strong><i>equivalencies</i></strong> for other rating systems,
              codes, or certifications when appropriate.
            </li>
            <li>
              Reviewing these approved alternatives, along with any previous
              <strong><i>amendments</i></strong> and
              <strong><i>frequently asked questions (FAQ)</i></strong> can help
              the team implement the feature.Use the filter option to quickly
              review features.
            </li>
          </ul>
          <p>
            Learn more about alternatives
            <a
              href="https://standard.wellcertified.com/aap"
              target="_blank"
              class="text-primary-600"
              >here</a
            >.
          </p>
        </div>
        <div class="w-1/3">
          <img
            src="https://cdn.wellcertified.com/static/images/feature-flexibility.png"
            class="img img-fluid px-2 mt-10"
          />
        </div>
      </div>
      <div class="w-full flex pt-5">
        <div class="w-2/3 text-md text-gray-600 font-light space-y-2 pr-8">
          <WHeadingsHFour heading="Feature Progress" />
          <hr class="py-1 border-secondary-300" />
          <p>
            Throughout the certification process, the
            <strong><i>summary report</i></strong> can provide a snapshot of
            your estimated achievement levels, as well as advice on next steps.
            It can be saved as a PDF to share with the project owner or other
            team members.
          </p>
          <ul class="list-disc pl-5">
            <li>
              The current status of a feature will be reflected on the summary,
              organized by the 7 concepts. An
              <strong><i>estimate</i></strong> of achievement towards Silver,
              Gold or Platinum will be provided based on your checklist
              responses.
            </li>
            <li>
              Feature guidance provides
              <strong><i>recommendations</i></strong> for the next actions
              needed for the team to determine feasibility, implement or prepare
              for review.
            </li>
          </ul>
          <p>
            Learn more about progress milestones
            <a
              href="https://www.wellcertified.com/en/articles/well-tip-guide-well-consulting"
              target="_blank"
              class="text-primary-600"
              >here</a
            >.
          </p>
        </div>
        <div class="w-1/3">
          <img
            src="https://cdn.wellcertified.com/static/images/feature-progress.png"
            class="img img-fluid px-2 mt-10"
          />
        </div>
      </div>
      <div class="w-full pt-5">
        <div class="w-2/3 text-md text-gray-600 font-light space-y-2">
          <WHeadingsHFour heading="Feature Support" />
          <hr class="py-1 border-secondary-300" />
          <p>
            IWBI and GBCI want to see your team achieve a successful
            certification for your project. Technical support is available in a
            variety of ways, let us know how we can help!
          </p>
          <ul class="list-disc pl-5">
            <li>
              Self-service guidance is provided in the feature
              <strong><i>FAQ, resource library</i></strong> and
              <strong><i>education courses</i></strong
              >.
            </li>
            <li>
              Direct support can be provided by contacting
              <a
                class="text-primary-600"
                href="mailto:technical@wellcertified.com"
                >technical@wellcertified.com</a
              >
              any time.
            </li>
            <li>
              Registered projects benefit from WELL
              <strong><i>coaching support</i></strong> who are available
              throughout the certification process.
            </li>
            <li>
              Monthly <strong><i>webcasts and events</i></strong> are a chance
              to learn the latest, and are a chance to hear from others in the
              WELL community pursuing certification.
            </li>
            <li>
              <strong><i>Articles</i></strong> are added regularly, often
              covering topics of feature implementation around the world that
              can inform and inspire.
            </li>
            <li>
              The citations and scientific research have been compiled into an
              extensive, interactive resource called
              <strong><i>WELLographies</i></strong
              >, useful for understanding why WELL features are important to
              your project.
            </li>
          </ul>
          <p>
            Learn more about resources
            <a
              href="https://www.wellcertified.com/well-ap/"
              class="text-primary-600"
              target="_blank"
              >here</a
            >.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      authToken: null,
      checklistUrl: process.env.checklistUrl,
    }
  },
  computed: {
    ...mapState({
      project: (state) => state.project.project,
      currentUser: (state) => state.user.currentUser,
    }),
    projectId() {
      let projectId = this.project.id
      if (this.project && this.project.v1_project_id !== null) {
        projectId = this.project.v1_project_id
      }
      return projectId
    },
    iframeSrc() {
      let projectId = this.project.id
      if (this.project) {
        if (this.project.v1_project_id !== null) {
          projectId = this.project.v1_project_id
        }
        return `${this.checklistUrl}/projects/${projectId}/scorecard?token=${this.authToken}`
      }
      return ''
    },
  },
  mounted() {
    this.$store
      .dispatch('project/getV1ChecklistAuthToken')
      .then((res) => (this.authToken = res.token))
  },
}
</script>
