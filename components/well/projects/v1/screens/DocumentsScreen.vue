<template>
  <div class="w-full py-5 lg:px-10">
    <WFeedbackModal ref="projectDocument">
      <div class="max-w-lg md:mx-10 my-5">
        <div class="flex justify-center mb-4">
          <div
            class="bg-red-100 flex flex-shrink-0 h-16 items-center justify-center mx-auto rounded-full sm:mx-0 w-16"
          >
            <svg
              class="h-8 w-8 text-red-600"
              x-description="Heroicon name: outline/exclamation"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              ></path>
            </svg>
          </div>
        </div>
        <div class="mb-5 text-primary-800 text-center py-4">
          This action cannot be undone. This will permanently delete this
          document.
        </div>
        <div
          class="md:flex justify-between md:space-x-5 space-y-4 md:space-y-0"
        >
          <div class="md:w-24">
            <WButtonsBase
              type="primaryInverted"
              @click.native="$refs.projectDocument.isHidden = true"
            >
              Cancel
            </WButtonsBase>
          </div>
          <WButtonsBase type="danger" @click.native="removeProjectDocument()">
            I understand the consequences, delete this document!
          </WButtonsBase>
        </div>
      </div>
    </WFeedbackModal>

    <WFeedbackModal ref="documentModal">
      <div class="text-center">
        We will notify you by email once we are ready with your file.
      </div>
    </WFeedbackModal>
    <WFeedbackModal ref="modal">
      <div class="max-w-lg md:mx-10 my-5">
        <div class="text-lg font-bold mb-5">Upload Document</div>

        <FormulateForm class="space-y-2" @submit="uploadFile">
          <FormulateInput
            v-model="formData.part_id"
            class="md:w-96"
            :options="partOptions"
            type="multi"
            label="Relevant feature(s)"
            validation="required"
            :multiple="true"
            track-by="value"
            :searchable="true"
          />
          <FormulateInput
            v-model="formData.v1_type"
            class="md:w-96"
            :options="typeOptions"
            type="select"
            label="Type"
            validation="required"
          />

          <FormulateInput
            v-if="formData.v1_type === 'Letter of Assurance'"
            v-model="formData.sub_type"
            class="md:w-96"
            :options="subTypeOptions"
            type="select"
            label="Letter of assurance signed by"
            validation="required"
          />

          <FormulateInput
            :key="forceReMount"
            v-model="formData.document"
            label="Attach Document"
            :value="formData.document"
            type="fileupload"
            :upload-path="'project/' + project_number + '/documents/'"
            mime-types=""
          />

          <FormulateInput type="submit" label="Upload" />
        </FormulateForm>
      </div>
    </WFeedbackModal>
    <div class="w-full flex flex-wrap">
      <div class="mb-3 w-full">
        <WHeadingsHThree heading="Documents" />
        <div class="md:flex md:space-x-2 space-y-2 md:space-y-0">
          <div v-if="!pendingReview && project.pending_review_id == null">
            <WButtonsBase
              icon="plus"
              @click.native="$refs.modal.isHidden = false"
            >
              Upload Document
            </WButtonsBase>
          </div>
          <div
            v-if="
              !pendingReview &&
              project.pending_review_id == null &&
              project.type === 'v1'
            "
          >
            <WButtonsBase
              icon="plus"
              @click.native="
                $router.push({
                  path: `/projects/${project.type}/${project.project_number}/reviews`,
                  query: { ...$route.query },
                })
              "
            >
              Submit for Review
            </WButtonsBase>
          </div>
          <div class="mt-5">
            <WButtonsDropdown>
              <WButtonsBase
                v-if="
                  currentUser.role.includes('well-admin') ||
                  (hasAccess &&
                    project.reviewers &&
                    project.reviewers.filter((a) => a.id === currentUser.id)
                      .length) ||
                  (hasAccess &&
                    project.members &&
                    project.members.filter((a) => a.id === currentUser.id)
                      .length &&
                    project.members.find((a) => a.id === currentUser.id).pivot
                      .role === 'project-admin')
                "
                type="primaryInverted"
                >Download</WButtonsBase
              >
              <template #customButtons>
                <div
                  v-if="
                    currentUser.role.includes('well-admin') ||
                    (hasAccess &&
                      project.reviewers &&
                      project.reviewers.filter((a) => a.id === currentUser.id)
                        .length) ||
                    (hasAccess &&
                      project.members &&
                      project.members.filter((a) => a.id === currentUser.id)
                        .length &&
                      project.members.find((a) => a.id === currentUser.id).pivot
                        .role === 'project-admin')
                  "
                >
                  <WButtonsBase
                    type="neutral"
                    @click.native="downloadDocuments({ include: 'project' })"
                  >
                    Project Documents
                  </WButtonsBase>
                </div>
                <div
                  v-if="
                    currentUser.role.includes('well-admin') ||
                    currentUser.role.includes('well-assessor') ||
                    (currentUser.role.includes('external-reviewer') &&
                      project.reviewers &&
                      project.reviewers.filter((a) => a.id === currentUser.id)
                        .length)
                  "
                >
                  <WButtonsBase
                    icon="download"
                    type="primaryInverted"
                    @click.native="downloadDocuments({ include: 'all' })"
                  >
                    Download All Documents
                  </WButtonsBase>
                </div>
                <div v-if="project.hsr_opt">
                  <WButtonsBase
                    v-if="
                      currentUser.role.includes('well-admin') ||
                      currentUser.role.includes('well-assessor') ||
                      (currentUser.role.includes('external-reviewer') &&
                        project.reviewers &&
                        project.reviewers.filter((a) => a.id === currentUser.id)
                          .length)
                    "
                    icon="download"
                    type="primaryInverted"
                    @click.native="downloadDocuments({ include: 'hsr' })"
                  >
                    Download All HSR Documents
                  </WButtonsBase>
                </div>
              </template>
            </WButtonsDropdown>
          </div>
        </div>
      </div>
      <div class="w-full">
        <div
          class="bg-primary-50 p-4 mb-5 rounded-lg border border-primary-300"
        >
          <div class="flex">
            <div class="ml-3">
              <div class="text-primary-600">
                <div class="block">
                  <h4
                    v-if="v1_project_standard === 'community'"
                    class="mt-2 text-xl leading-7 font-semibold"
                  >
                    The general documentation required for WELL Community are
                    the following:
                  </h4>
                  <h4 v-else class="mt-2 text-xl leading-7 font-semibold">
                    Along with your scorecard documentation, please upload the
                    following documents.
                  </h4>
                </div>
                <div class="mt-3"></div>
              </div>
              <div class="mt-2 text-sm leading-5 text-primary-700">
                <ul
                  v-if="v1_project_standard === 'community'"
                  class="list-disc pl-4"
                >
                  <li>Signed WELL Certification Agreement.</li>
                  <li>A project checklist.</li>
                  <li>Representative plans or project maps.</li>
                  <li>
                    Narrative describing the project in general, listing the
                    attempted features and identifying which buildings in the
                    master plan will be pursuing a health and wellness and/or
                    green building certification.
                  </li>
                  <li>
                    Community narrative detailing the mission and goals of the
                    WELL community, the stakeholders involved, the expected
                    timelines and schedules for various types of development and
                    how health and wellness are integrated into the project.
                  </li>
                </ul>
                <ul v-else class="list-disc pl-4">
                  <li>
                    A completed copy of the
                    <a
                      class="font-bold"
                      href="https://resources.wellcertified.com/tools/well-project-information-form/"
                      target="_blank"
                      >Project Information Form</a
                    >
                  </li>
                  <li>Representative floor plans for the entire building</li>
                  <li>Photos, renderings, or drawings</li>
                  <li>Sections/elevations</li>
                  <li>Mechanical schedules, plans and/or drawings</li>
                  <li>
                    A completed project checklist or other document confirming
                    which WELL Features are being attempted
                  </li>
                  <li>Any approved AAPs being utilized by the project</li>
                  <li>
                    When the project has uploaded all relevant documentation,
                    use the
                    <i>Submit for review</i>
                    button to engage in a formal review process
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="md:flex w-full items-start mt-5 mb-4 md:mb-0">
          <div class="md:w-4/6 lg:w-3/4">
            <FormulateInput
              v-model="documentSearch"
              type="text"
              placeholder="Search document..."
            />
          </div>
          <div
            class="md:w-2/6 lg:w-1/4 md:ml-5 sm:flex space-y-2 sm:space-y-0 -mt-2 md:-mt-0"
          >
            <WButtonsBase icon="search-circle" @click.native="getDocuments"
              >Search</WButtonsBase
            >
            <WButtonsBase
              class="sm:ml-2"
              type="danger"
              icon="refresh"
              @click.native="documentSearch = ''"
            >
              Reset</WButtonsBase
            >
          </div>
        </div>
        <div
          class="overflow-x-scroll ring-1 rounded-lg shadow-lg ring-gray-200"
        >
          <table
            v-if="documents && documents.length"
            class="w-full divide-y divide-gray-200"
          >
            <thead>
              <tr>
                <th
                  class="px-6 py-3 bg-gray-50 w-64 whitespace-normal text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
                >
                  Document
                </th>
                <th
                  class="px-6 py-3 bg-gray-50 w-64 whitespace-normal text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
                >
                  Feature
                </th>
                <th
                  class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
                >
                  Type
                </th>
                <th
                  class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
                >
                  Uploaded By
                </th>
                <th
                  class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
                ></th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(document, index) in documents" :key="index">
                <td class="px-6 py-4 w-64 whitespace-normal">
                  <div
                    class="cursor-pointer text-primary-500 text-bold text-sm leading-5"
                  >
                    <WLinksBase
                      target="_blank"
                      :link="document.link_s3_private"
                    >
                      {{ document.name }}
                    </WLinksBase>
                  </div>
                </td>
                <td class="px-6 py-4 w-64 whitespace-normal">
                  <div class="text-sm leading-5 text-gray-900">
                    {{ getFeatureName(document.v1features) }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm leading-5 text-gray-900">
                    {{ document.v1_type }}
                  </div>
                  <div
                    v-if="document.v1_type === 'Letter of Assurance'"
                    class="text-sm leading-5 text-gray-400"
                  >
                    Signed by {{ document.sub_type }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm leading-5 text-gray-900">
                    {{ document.user_name }}
                  </div>
                  <div class="text-sm leading-5 text-gray-400">
                    {{ $dayjs(document.created_at).format('MMM DD, YYYY') }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm leading-5 text-gray-900">
                    <WButtonsBase
                      v-if="
                        (!currentUser.role.includes('external-reviewer') &&
                          accessLevel !== 'project-member') ||
                        document.user_id === currentUser.id
                      "
                      icon="trash"
                      @click.native="
                        ;($refs.projectDocument.isHidden = false),
                          (selectedDocument = document)
                      "
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-else class="rounded-md bg-blue-50 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg
                  class="h-5 w-5 text-blue-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div class="ml-3 flex-1 md:flex md:justify-between">
                <p class="text-sm text-blue-700">
                  You haven't uploaded any documents yet.
                </p>
              </div>
            </div>
          </div>
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
      documentSearch: '',
      formData: {
        v1_type: null,
        sub_type: null,
        document: [],
        part_id: [],
      },
      apiResponse: '',
      typeOptions: [
        { label: 'General', value: 'general' },
        { label: 'Architectural Drawing', value: 'Architectural Drawing' },
        { label: 'Annotated Documents', value: 'Annotated Documents' },
        { label: 'Commissioning Report', value: 'Commissioning Report' },
        { label: 'Innovation Proposal', value: 'Innovation Proposal' },
        { label: 'Letter of Assurance', value: 'Letter of Assurance' },
        { label: 'Narrative', value: 'Narrative' },
        { label: 'Ongoing Documentation', value: 'Ongoing Documentation' },
        { label: 'Operations Schedule', value: 'Operations Schedule' },
        { label: 'Policy Document', value: 'Policy Document' },
        { label: 'Remediation Report', value: 'Remediation Report' },
      ],
      subTypeOptions: [
        { label: 'Acoustical Consultant', value: 'Acoustical Consultant' },
        { label: 'Architect', value: 'Architect' },
        { label: 'Contractor', value: 'Contractor' },
        { label: 'Lighting Designer', value: 'Lighting Designer' },
        { label: 'MEP', value: 'MEP' },
        { label: 'Owner', value: 'Owner' },
      ],
      forceReMount: 0,
      selectedDocument: null,
    }
  },
  computed: {
    ...mapState({
      currentUser: (state) => state.user.currentUser,
      project_number: (state) => state.project.project.project_number,
      documents: (state) => state.project.projectDocuments,
      scorecard_documents: (state) => state.scorecard.documents,
      shared_documents: (state) => state.scorecard.documents,
      features: (state) => state.features.features,
      project: (state) => state.project.project,
      accessLevel: (state) => state.project.accessLevel,
      pendingReview() {
        return (
          this.$store.state.review.allReviews.filter(
            (a) => a.status === 'pending' || a.status === 'mid-review'
          ).length > 0
        )
      },
    }),
    partOptions() {
      const options = []
      if (this.features) {
        for (let b = 0; b < this.features.length; b++) {
          if (this.project.type === 'v1') {
            const option = {
              label: this.features[b].name,
              value: this.features[b].id.toString(),
            }
            options.push(option)
          } else {
            for (let i = 0; i < this.features[b].parts.length; i++) {
              const option = {
                label:
                  this.features[b].parts[i].part_prefix +
                  ' ' +
                  this.features[b].parts[i].name,
                value: this.features[b].parts[i].id.toString(),
              }
              options.push(option)
            }
          }
        }

        if (this.project.type !== 'v1') {
          options.sort(function (a, b) {
            if (a.label < b.label) {
              return -1
            }
            if (a.label > b.label) {
              return 1
            }
            return 0
          })
        }
        return options
      }
      return []
    },
    hasAccess() {
      if (this.currentUser.role.includes('well-admin')) {
        return true
      } else if (
        this.accessLevel === 'project-admin' ||
        this.accessLevel === 'project-manager'
      ) {
        return true
      }
      return false
    },
  },
  mounted() {
    const communityFlag =
      this.project.v1_project_standard === 'community' ? 1 : 0
    this.$store.dispatch('features/getAllV1Features', communityFlag)

    this.$store.dispatch('project/getProjectDocuments', this.documentSearch)

    if (this.project.hsr_scorecard_id) {
      this.$store.dispatch('shared/getDocuments', {
        id: this.project.hsr_scorecard_id,
        name: this.documentSearch,
      })
    }
  },
  methods: {
    removeProjectDocument() {
      this.$store
        .dispatch('project/removeProjectDocument', this.selectedDocument.id)
        .then(() => {
          this.$store.dispatch('notifications/toastMessage', {
            message: 'Document deleted',
          })
        })
      this.$refs.projectDocument.isHidden = true
    },
    getDocuments() {
      this.$store.dispatch('shared/getDocuments', {
        id: this.project.hsr_scorecard_id,
        name: this.documentSearch,
      })
    },
    getFeatureName(f) {
      const res = f.map((a) => a.name)
      return res.join(', ')
    },
    handleFileChange(event) {
      this.newPartDocument = event.target.files[0]
    },
    downloadDocuments(payload) {
      this.$store
        .dispatch('project/downloadAllDocuments', payload)
        .then((response) => {
          this.$refs.documentModal.isHidden = false
        })
        .catch((err) => {
          this.apiResponse = err.data.message
        })
    },
    async uploadFile() {
      this.formData.features = this.formData.part_id
        ? this.formData.part_id.map((e) => {
            return e.value
          })
        : []
      this.formData.link_s3 = this.formData.document[0].url
      this.formData.type = 'general'
      this.formData.name = this.formData.document[0].name

      await this.$store
        .dispatch('project/uploadProjectDocument', this.formData)
        .then(
          (this.formData = { document: [], v1_type: null, sub_type: null }),
          (this.$refs.modal.isHidden = true),
          this.forceReMount++
        )
    },
  },
}
</script>
