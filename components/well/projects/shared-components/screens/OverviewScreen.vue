<template>
  <div class="flex flex-wrap">
    <WFeedbackModal ref="modal">
      <div class="max-w-lg mx-10 my-5">
        <div class="text-lg font-bold mb-5">
          This action cannot be undone. This will permanently change the version
          of #{{ project.project_number }} - {{ project.name }} project,
          scorecard, alternatives.
        </div>
        <WButtonsBase
          @click.native="
            $refs.modal.isHidden = true
            $store.dispatch(
              'project/updateProjectVersion',
              newVersionData.version
            ),
              $store.dispatch('notifications/toastMessage', {
                message:
                  'This process will take some time. We will notify you via email.',
              })
          "
          >I understand the consequences, update this project!</WButtonsBase
        >
      </div>
    </WFeedbackModal>
    <WFeedbackModal ref="v2UpgradeModal">
      <div class="mx-5 w-full text-lg font-bold">
        Are you sure you want to upgrade your project to WELL v2?
      </div>
      <hr class="my-3 mx-5 border-secondary-300" />
      <div class="max-w-lg m-5">
        <div class="text-sm font-normal mb-5">
          When you upgrade your project to WELL v2, only certain information
          will be transferred to your new project. You'll need to create a new
          scorecard using WELL v2 and we recommend reviewing the below lists to
          understand what will and will not be transferred. You will be able to
          access an archived version of your WELL v2 pilot project after you
          upgrade, however no actions can be taken within this archived project.
        </div>
        <dl
          class="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 pb-4 text-sm"
        >
          <div class="sm:col-span-1">
            <dt class="text-sm font-medium text-gray-500">
              Information transferred
            </dt>
            <dd class="mt-1 text-sm text-gray-900">
              <ul class="list-disc">
                <li>Project details (including addresses and space types)</li>
                <li>Project team (including coaching contact)</li>
                <li>Project profile information</li>
                <li>WELL Health-Safety checklist and invoices (if enrolled)</li>
                <li>General project documents</li>
                <li>Paid project invoices</li>
              </ul>
            </dd>
          </div>
          <div class="sm:col-span-1">
            <dt class="text-sm font-medium text-gray-500">
              Information not transferred
            </dt>
            <dd class="mt-1 text-sm text-gray-900">
              <ul class="list-disc">
                <li>v2 Pilot scorecard (including documents and notes)</li>
                <li>Unpaid invoices</li>
                <li>Documentation reviews</li>
                <li>Coaching contact support tickets</li>
              </ul>
            </dd>
          </div>
        </dl>
        <WButtonsBase class="mt-2" @click.native="upgradeProjectToV2()"
          >Yes, I'd like to upgrade my project</WButtonsBase
        >
      </div>
    </WFeedbackModal>
    <div class="w-full mb-5 lg:w-1/3 lg:pr-16">
      <div>
        <WHeadingsHThree
          v-if="
            currentUser.role.includes('well-admin') &&
            project.portfolio_ids.length
          "
          heading="Portfolio Project"
        />
        <div
          v-if="
            currentUser.role.includes('well-admin') &&
            project.portfolio_ids.length &&
            portfolioInfo
          "
          class="mb-2"
        >
          This project is registered as part of
          <strong
            >{{ portfolioInfo.portfolio_number }} -
            {{ portfolioInfo.name }}</strong
          >
          portfolio under the WELL Portfolio program.
        </div>
        <hr class="my-3 mx-3 border-primary-200" />
        <WHeadingsHThree heading="Access Digital Standard" />
        <div class="mb-2">
          The WELL Building Standard applicable for your project is
          <b>
            {{ project.addenda_version_name }}
            addenda </b
          >.
          <WLinksBase
            class="mt-2"
            target="_blank"
            icon="arrow-narrow-right"
            :link="`https://v2.wellcertified.com/${standardVersion}/en/overview`"
          >
            Learn More
          </WLinksBase>
          <div
            v-if="
              currentUser.role.includes('well-admin') &&
              project.type !== 'v2-pilot-upgraded'
            "
          >
            <hr class="my-3 mx-3 border-primary-200" />
            <WHeadingsHThree heading="Update Digital Standard" />
            <FormulateForm @submit="changeStandard()">
              <FormulateInput
                v-model="newVersionData.version"
                :options="standardOptions"
                type="select"
                placeholder="Select version"
                validation="required"
              />
              <div class="mt-2">
                <FormulateInput type="submit" label="Save" />
              </div>
            </FormulateForm>
          </div>
        </div>
        <hr class="my-3 mx-3 border-primary-200" />
        <div
          v-if="
            project.type !== 'v2' &&
            project.type !== 'v2-pilot-upgraded' &&
            (project.members.find(
              (a) =>
                a.id === $store.state.user.currentUser.id &&
                a.pivot.role === 'project-admin'
            ) ||
              $store.state.user.currentUser.role.includes('well-admin'))
          "
        >
          <WHeadingsHThree heading="Upgrade Project to WELL v2" />
          <div class="mb-2">
            <hr class="my-3 mx-3 border-primary-200" />
            <WButtonsBase
              type="primary"
              @click.native="$refs.v2UpgradeModal.isHidden = false"
            >
              Upgrade
            </WButtonsBase>
          </div>
        </div>
        <div
          v-if="project.cert_status && project.cert_status !== 'na'"
          class="bg-white shadow rounded"
        >
          <div class="text-center">
            <img
              v-if="project.project_type === 'cs'"
              class="img img-fluid w-40 mx-auto"
              :src="
                'https://cdn.wellcertified.com/static/images/well-core-' +
                project.cert_status.toLowerCase() +
                '-solid-new.png'
              "
            />
            <img
              v-else
              class="img img-fluid w-40 mx-auto"
              :src="
                'https://cdn.wellcertified.com/static/images/well-' +
                project.cert_status.toLowerCase() +
                '-solid-new.png'
              "
            />
          </div>
          <span class="text-sm font-semibold text-primary-900 text-center"
            >Your WELL Certification seal is valid<br />from
            {{ $dayjs(project.date_certified).format('MMM DD, YYYY') }}
            to
            {{
              $dayjs(project.date_certified)
                .add(3, 'year')
                .format('MMM DD, YYYY')
            }}</span
          >
        </div>
        <div
          v-if="
            project.hsr_status !== null && project.hsr_achieved_date !== null
          "
          class="bg-white shadow rounded"
        >
          <hr class="my-3 mx-3 border-primary-200" />

          <div class="text-center whitespace-nowrap">
            <strong class="font-bold">WELL Health-Safety Rating</strong>
            <img
              src="https://a.storyblok.com/f/52232/800x800/540bd08b16/well-health-safety_gradient_2020.png"
              class="img img-fluid w-40 mx-auto"
            />
          </div>
          <div
            class="text-center bg-primary-100 font-bold text-primary-600 py-2"
          >
            {{ $dayjs(project.hsr_achieved_date).format('MMM DD, YYYY') }}
          </div>
        </div>
      </div>
    </div>
    <div class="w-full lg:w-2/3">
      <table class="mt-5 w-full mx-auto shadow">
        <thead>
          <tr>
            <th
              colspan="2"
              class="
                px-6
                py-3
                bg-primary-700
                text-left text-xs
                leading-4
                font-medium
                text-white
                uppercase
                tracking-wider
              "
            >
              Project Information
            </th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr>
            <td
              class="
                w-1/2
                px-6
                py-4
                text-sm
                leading-5
                font-medium
                text-gray-900
              "
            >
              <div class="font-medium mb-2">Project ID</div>
            </td>
            <td
              class="
                flex
                font-medium
                h-full
                leading-5
                px-6
                py-4
                text-gray-900 text-sm
              "
            >
              {{ project.project_number }}
            </td>
          </tr>
          <tr class="">
            <td class="px-6 py-4 text-sm leading-5 font-medium text-gray-900">
              <div class="font-medium mb-2">Project Name</div>
            </td>
            <td
              class="
                flex
                font-medium
                h-full
                leading-5
                px-6
                py-4
                text-gray-900 text-sm
              "
            >
              {{ project.name }}
            </td>
          </tr>
          <tr v-if="project.type !== 'v1'">
            <td class="px-6 py-4 text-sm leading-5 font-medium text-gray-900">
              <div class="font-medium mb-2">Project Type</div>
            </td>
            <td
              class="
                flex
                font-medium
                h-full
                leading-5
                px-6
                py-4
                text-gray-900 text-sm
              "
            >
              <span v-if="project.project_type">
                {{ projectTypes[project.project_type] }} ({{
                  project.project_type
                }})
              </span>
              <span v-else> v1 </span>
            </td>
          </tr>
          <tr v-if="project.type !== 'v1'" class="">
            <td
              class="flex px-6 py-4 text-sm leading-5 font-medium text-gray-900"
            >
              <div class="font-medium mb-auto">Space Types</div>
            </td>
            <td
              class="
                font-medium
                h-full
                leading-5
                px-6
                py-4
                text-gray-900 text-sm
              "
            >
              <ul class="list-disc ml-4">
                <li
                  v-for="spaceType in project.space_types.filter(
                    (space) => space.name !== 'Outdoor Spaces'
                  )"
                  :key="spaceType.id"
                >
                  {{ spaceType.name }}
                  <div
                    v-if="spaceType.id === project.primary_space_type_id"
                    class="
                      bg-primary-700
                      inline
                      ml-2
                      px-2
                      rounded-full
                      text-center text-white text-xs
                      uppercase
                      w-24
                    "
                  >
                    Primary
                  </div>
                </li>
              </ul>
            </td>
          </tr>
          <tr>
            <td class="px-6 py-4 text-sm leading-5 font-medium text-gray-900">
              <div class="font-medium mb-2">Gross Area</div>
            </td>
            <td
              class="
                font-medium
                h-full
                leading-5
                px-6
                py-4
                text-gray-900 text-sm
              "
            >
              <div>
                {{ project.area | formatNumber }}
                <span v-if="project.type !== 'v1'"> sq ft </span>
                <span v-else> acre </span>
              </div>
              <div>
                {{ project.area_in_meter | formatNumber }}
                <span v-if="project.type !== 'v1'"> sq m </span>
                <span v-else> hectare </span>
              </div>
            </td>
          </tr>
          <tr
            v-if="project.type === 'v1' || project.type === 'v1-upgraded'"
            class=""
          >
            <td class="px-6 py-4 text-sm leading-5 font-medium text-gray-900">
              <div class="font-medium mb-2">Current status of project</div>
            </td>
            <td
              class="
                font-medium
                h-full
                leading-5
                px-6
                py-4
                text-gray-900 text-sm
              "
            >
              {{
                projecStatusList.find(
                  (status) => status.value === project.current_status
                ).text
              }}
            </td>
          </tr>
          <tr class="">
            <td class="px-6 py-4 text-sm leading-5 font-medium text-gray-900">
              <div class="font-medium mb-2">Project Location</div>
            </td>
            <td
              class="
                font-medium
                h-full
                leading-5
                px-6
                py-4
                text-gray-900 text-sm
              "
            >
              <div>
                <span class="font-bold"> Street: </span>
                <span v-if="project.addresses[0].street">
                  {{ project.addresses[0].street }}
                </span>
              </div>

              <div>
                <span class="font-bold"> City: </span>
                <span v-if="project.addresses[0].city">
                  {{ project.addresses[0].city }}
                </span>
              </div>

              <div>
                <span class="font-bold"> State: </span>
                <span v-if="project.addresses[0].state">
                  {{ project.addresses[0].state }}
                </span>
              </div>

              <div>
                <span class="font-bold"> Country: </span>
                <span v-if="project.addresses[0].country_code">
                  {{
                    countries.filter(
                      (a) => a.code === project.addresses[0].country_code
                    )[0].name
                  }}
                </span>
              </div>
            </td>
          </tr>
          <tr>
            <td class="px-6 py-4 text-sm leading-5 font-medium text-gray-900">
              <div class="font-medium mb-2">
                Anticipated Date of construction completion
              </div>
            </td>
            <td
              class="
                flex
                font-medium
                h-full
                leading-5
                px-6
                py-4
                text-gray-900 text-sm
              "
            >
              <span v-if="project.construction_completion_date">
                {{
                  $dayjs(project.construction_completion_date).format(
                    'MMM DD, YYYY'
                  )
                }}
              </span>
            </td>
          </tr>
          <tr class="">
            <td class="px-6 py-4 text-sm leading-5 font-medium text-gray-900">
              <div class="font-medium mb-2">
                Estimated date of document submission
              </div>
            </td>
            <td
              class="
                flex
                font-medium
                h-full
                leading-5
                px-6
                py-4
                text-gray-900 text-sm
              "
            >
              <span v-if="project.doc_sub_date_est">
                {{ $dayjs(project.doc_sub_date_est).format('MMM DD, YYYY') }}
              </span>
            </td>
          </tr>
          <tr>
            <td class="px-6 py-4 text-sm leading-5 font-medium text-gray-900">
              <div class="font-medium mb-2">Owner</div>
            </td>
            <td
              class="
                flex
                font-medium
                h-full
                leading-5
                px-6
                py-4
                text-gray-900 text-sm
              "
            >
              {{ project.owner_email }}
            </td>
          </tr>
          <tr class="">
            <td class="px-6 py-4 text-sm leading-5 font-medium text-gray-900">
              <div class="font-medium mb-2">Owner Industry</div>
            </td>
            <td
              class="
                flex
                font-medium
                h-full
                leading-5
                px-6
                py-4
                text-gray-900 text-sm
              "
            >
              {{ project.industry }}
            </td>
          </tr>
          <tr v-if="project.type !== 'v1'">
            <td class="px-6 py-4 text-sm leading-5 font-medium text-gray-900">
              <div class="font-medium mb-2">Owner Website</div>
            </td>
            <td
              class="
                flex
                font-medium
                h-full
                leading-5
                px-6
                py-4
                text-gray-900 text-sm
              "
            >
              {{ project.org_website }}
            </td>
          </tr>
          <tr v-if="project.type !== 'v1'" class="">
            <td class="px-6 py-4 text-sm leading-5 font-medium text-gray-900">
              <div class="font-medium mb-2">Owner Organization Overview</div>
            </td>
            <td
              class="
                flex
                font-medium
                h-full
                leading-5
                px-6
                py-4
                text-gray-900 text-sm
              "
            >
              {{ project.org_overview }}
            </td>
          </tr>
          <tr>
            <td class="px-6 py-4 text-sm leading-5 font-medium text-gray-900">
              <div class="font-medium mb-2">Target Certification Level</div>
            </td>
            <td
              class="
                flex
                font-medium
                h-full
                leading-5
                px-6
                py-4
                text-gray-900 text-sm
              "
            >
              {{ project.target_cert_level }}
            </td>
          </tr>
          <tr class="">
            <td class="px-6 py-4 text-sm leading-5 font-medium text-gray-900">
              <div class="font-medium mb-2">WELL Project Goals and Vision</div>
            </td>
            <td
              class="
                flex
                font-medium
                h-full
                leading-5
                px-6
                py-4
                text-gray-900 text-sm
              "
            >
              {{ project.goals_and_vision }}
            </td>
          </tr>
          <tr>
            <td class="px-6 py-4 text-sm leading-5 font-medium text-gray-900">
              <div class="font-medium mb-2">Public Project</div>
            </td>
            <td
              class="
                flex
                font-medium
                h-full
                leading-5
                px-6
                py-4
                text-gray-900 text-sm
              "
            >
              <span v-if="project.project_public === 1">
                Yes, I want to show my project in Directory
              </span>
              <span v-else>No, I want my project to be private</span>
            </td>
          </tr>
        </tbody>
      </table>
      <table
        v-if="currentUser.role.includes('well-admin')"
        class="mt-5 w-full mx-auto shadow"
      >
        <thead>
          <tr>
            <th
              colspan="2"
              class="
                px-6
                py-3
                bg-primary-700
                text-left text-xs
                leading-4
                font-medium
                text-white
                uppercase
                tracking-wider
              "
            >
              Admin Information
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td
              class="
                w-1/2
                px-6
                py-4
                text-sm
                leading-5
                font-medium
                text-gray-900
              "
            >
              <div class="font-medium mb-2">Coaching contact</div>
            </td>
            <td
              class="
                flex
                font-medium
                h-full
                leading-5
                px-6
                py-4
                text-gray-900 text-sm
              "
            >
              <div v-if="project.coach">
                {{ project.coach.name }} {{ project.coach.last_name }}<br />
                <span class="text-gray-500">{{ project.coach.email }}</span>
              </div>
              <span v-else class="text-gray-400 italic"> N/A </span>
            </td>
          </tr>
          <tr class="">
            <td class="px-6 py-4 text-sm leading-5 font-medium text-gray-900">
              <div class="font-medium mb-2">Project phase</div>
            </td>
            <td
              class="
                flex
                font-medium
                h-full
                leading-5
                px-6
                py-4
                text-gray-900 text-sm
              "
            >
              <span v-if="project.project_phase">
                {{ project.project_phase }}
              </span>
              <span v-else class="text-gray-400 italic"> N/A </span>
            </td>
          </tr>
          <tr>
            <td class="px-6 py-4 text-sm leading-5 font-medium text-gray-900">
              <div class="font-medium mb-2">Project challenges</div>
            </td>
            <td
              class="
                flex
                font-medium
                h-full
                leading-5
                px-6
                py-4
                text-gray-900 text-sm
              "
            >
              <span v-if="project.challenges">
                {{ project.challenges }}
              </span>
              <span v-else class="text-gray-400 italic"> N/A </span>
            </td>
          </tr>
          <tr class="">
            <td
              class="flex px-6 py-4 text-sm leading-5 font-medium text-gray-900"
            >
              <div class="font-medium mb-auto">WELL challenge notes</div>
            </td>
            <td
              class="
                font-medium
                h-full
                leading-5
                px-6
                py-4
                text-gray-900 text-sm
              "
            >
              <span v-if="project.challenge_note">
                {{ project.challenge_note }}
              </span>
              <span v-else class="text-gray-400 italic"> N/A </span>
            </td>
          </tr>
          <tr>
            <td class="px-6 py-4 text-sm leading-5 font-medium text-gray-900">
              <div class="font-medium mb-2">WELL communication notes</div>
            </td>
            <td
              class="
                font-medium
                h-full
                leading-5
                px-6
                py-4
                text-gray-900 text-sm
              "
            >
              <span v-if="project.communication_note">
                {{ project.communication_note }}
              </span>
              <span v-else class="text-gray-400 italic"> N/A </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  props: {
    project: {
      type: Object,
      required: true,
    },
    countries: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      projectTypes: {
        'new-existing': 'A building that I own & occupy',
        'non-cs': 'A building I own and lease out/sell',
        cs: 'WELL Core',
        cics: 'A space I lease',
      },
      newVersionData: {
        version: null,
      },
      projecStatusList: [
        { text: 'Concept Design', value: 'concept_design' },
        { text: 'Schematic Design', value: 'schematic_design' },
        { text: 'Design Development', value: 'design_development' },
        {
          text: 'Construction Documentation',
          value: 'construction_documentation',
        },
        { text: 'Under construction', value: 'under_construction' },
        { text: 'Construction complete', value: 'construction_complete' },
        {
          text: 'Existing building or space',
          value: 'existing_building_or_space',
        },
      ],
      portfolioInfo: null,
    }
  },
  computed: {
    ...mapState({
      currentUser: (state) => state.user.currentUser,
      standards: (state) => state.project.standards,
    }),
    standardVersion() {
      let version = ''
      if (this.standards) {
        version = this.standards.find(
          (a) => a.id === this.project.applicable_version_id
        ).version
      }

      return version
    },
    standardOptions() {
      let options = []

      if (this.standards && this.project) {
        options = this.standards.filter(
          (a) =>
            a.type === this.project.type &&
            a.is_published === 1 &&
            a.language[0].code === 'en' &&
            a.id !== this.project.applicable_version_id
        )

        options.map((option, index) => {
          options[index] = {
            label: option.name,
            value: option.id,
          }
          return options[index]
        })
      }
      return options
    },
  },
  async mounted() {
    await this.$store.dispatch('project/getStandards')
    this.getPortfolioInfo()
  },
  methods: {
    changeStandard() {
      this.$refs.modal.isHidden = false
    },
    upgradeProjectToV2() {
      this.$axios
        .get(`api/project/${this.project.id}/v2upgrade`)
        .then((response) => {
          this.$store.dispatch('notifications/toastMessage', {
            message: 'Project upgraded successfully!',
          })
          this.$refs.v2UpgradeModal.isHidden = true
          this.$router.push(
            '/projects/v2/' + response.data.project_number + '/dashboard'
          )
        })
        .catch((response) => {
          this.$store.dispatch('notifications/toastMessage', {
            message: 'There was a problem in upgrading this project.',
          })
        })
    },
    getPortfolioInfo() {
      if (this.project.portfolio_ids.length) {
        const id = this.project.portfolio_ids[0]
        this.$axios.get(`api/portfolio/${id}`).then((response) => {
          this.portfolioInfo = response.data
        })
      }
    },
  },
}
</script>
