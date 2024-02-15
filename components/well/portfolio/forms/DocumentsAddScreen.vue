<template>
  <div>
    <WFeedbackAlert ref="alert" />
    <FormulateForm
      class="space-y-6 max-w-4xl mx-auto my-10 border rounded-md p-5"
      @submit="uploadDocument"
    >
      <div v-if="uploadDocumentModalTab === 1" class="mb-5">
        <FormulateInput
          v-model="documentType"
          type="select"
          name="documentType"
          label="I would like to *"
          placeholder="Select option"
          :options="[
            {
              label: 'Upload the requested general information items',
              value: 'general',
            },
            { label: 'Upload a legal document', value: 'legal' },
            { label: 'Upload an audit document', value: 'audit' },
            {
              label: 'Upload verification of a WELL feature',
              value: 'feature',
            },
          ]"
          validation="required"
        />
      </div>
      <div v-if="documentType === 'legal'" class="mb-5">
        <FormulateInput
          v-model="formData.legalTypeSelected"
          type="select"
          label="Type *"
          placeholder="Select option"
          :options="legalTypes"
          validation="required"
        />
      </div>
      <div v-if="documentType === 'general'" class="mb-5">
        <FormulateInput
          v-model="formData.generalTypeSelected"
          type="select"
          label="Type *"
          placeholder="Select option"
          :options="generalTypes"
          validation="required"
        />
      </div>
      <div v-if="showFeatures && uploadDocumentModalTab === 1">
        <div class="mb-5">
          <FormulateInput
            v-model="versionSelected"
            :disabled="disableVersionSelection"
            type="select"
            label="Version"
            placeholder="Select option"
            :options="versions"
            validation="required"
          />
        </div>

        <div class="mb-5">
          <FormulateInput
            v-model="formData.featureLocationTypeSelected"
            :options="featureLocationOptions"
            label="Does this verification apply to a single location, multiple or
                all locations? *"
            type="radio"
            validation="required"
          />
        </div>
        <div class="mb-5">
          <FormulateInput
            v-model="formData.verificationImpementSelected"
            :options="verificationImpementOptions"
            label="Does this verification reflect implemented guidelines,
                policies, or features?*"
            type="radio"
            validation="required"
          />
        </div>
        <div v-if="versionSelected" class="mb-5">
          <label
            for="featuredocumentType"
            class="w-full text-sm font-bold leading-5 text-gray-700 sm:mt-px sm:pt-2"
            >Verification Method</label
          >
          <multiselect
            v-if="versionSelected === 'v2-pilot'"
            v-model="featuredocumentType"
            open-direction="bottom"
            :multiple="false"
            :searchable="true"
            :hide-selected="false"
            :allow-empty="true"
            :show-labels="false"
            label="label"
            placeholder="Please Select"
            track-by="value"
            name="featuredocumentType"
            :options="documentTypeArrayOption"
          >
          </multiselect>
          <multiselect
            v-if="versionSelected === 'v2'"
            v-model="featuredocumentType"
            open-direction="bottom"
            :multiple="false"
            :searchable="true"
            :hide-selected="false"
            :allow-empty="true"
            :show-labels="false"
            label="label"
            placeholder="Please Select"
            track-by="value"
            name="featuredocumentType"
            :options="verificationListOption"
          >
          </multiselect>
        </div>
        <div class="mb-5">
          <label
            for="partSelected"
            class="w-full text-sm font-bold leading-5 text-gray-700 sm:mt-px sm:pt-2"
            >Which parts are contained in your verification document? *</label
          >
          <multiselect
            v-model="formData.partSelected"
            open-direction="bottom"
            label="name"
            :multiple="true"
            :searchable="true"
            :hide-selected="false"
            :allow-empty="true"
            track-by="id"
            :show-labels="false"
            placeholder="Please Select Parts"
            group-values="parts"
            group-label="feature"
            validation="required"
            name="part"
            :options="featureandParts"
          >
          </multiselect>
          <p
            v-if="!featureandParts.length && featuredocumentType"
            class="mt-2 text-sm text-red-600"
          >
            No parts available for the selected verification
          </p>
        </div>
        <div
          v-if="formData.featureLocationTypeSelected === 'single'"
          class="mb-5"
        >
          <FormulateInput
            v-model="singleProject"
            :options="subsetProjects"
            placeholder="select location"
            label="Which of your location share this verification
                  document?"
            type="select"
          />
        </div>
      </div>
      <div v-if="uploadDocumentModalTab === 1" class="mb-5">
        <FormulateInput
          v-if="documentType !== 'audit' && documentType !== 'feature'"
          v-model="formData.document"
          :value="formData.document"
          label="Attach Document(s):"
          type="fileupload"
          :upload-path="`portfolio/${portfolio.portfolio_number}/documents/`"
          mime-types=""
          validation="required"
        />
        <div v-else>
          <div
            v-if="!newDocument"
            class="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"
          >
            <div class="text-center w-full">
              <div class="mt-1 text-sm text-gray-600">
                <ul></ul>
                <div class="overflow-hidden relative w-full mt-4 mb-4">
                  <div class="text-center w-full">
                    <svg
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      class="mx-auto h-12 w-12 text-gray-400"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                    </svg>
                    <div class="mt-1 text-sm text-gray-600">
                      <div
                        class="font-medium text-primary-600 hover:text-primary-500 focus:outline-none focus:underline transition duration-150 ease-in-out"
                      >
                        Upload a file
                      </div>
                      or drag and drop
                    </div>
                    <p class="mt-1 text-xs text-gray-500"></p>
                  </div>
                  <input
                    type="file"
                    accept=""
                    class="cursor-pointer absolute block py-2 px-4 w-full h-full opacity-0 top-0"
                    @change="handleFileChange($event)"
                  />
                </div>
              </div>
            </div>
          </div>
          <div v-else>
            <ul>
              <li
                class="bg-gray-100 max-w-md mx-auto px-4 py-3 rounded-md shadow-md my-4 relative"
              >
                <span>
                  {{ newDocument.name }}
                </span>
                <button
                  class="right-0 absolute mr-3 text-danger-500"
                  type="button"
                  @click="newDocument = null"
                >
                  remove
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div v-if="!showFeatures && uploadDocumentModalTab === 1">
        <div class="mb-5">
          <ClientOnly>
            <FormulateInput
              v-model="formData.remark"
              type="richtext"
              label="Comment"
              validation="required"
            />
          </ClientOnly>
        </div>
      </div>
      <div v-if="uploadDocumentModalTab === 2">
        <div>
          <div class="mb-5">
            <WHeadingsHThree
              class="text-primary-900"
              heading="Assign to subsets"
            />
          </div>
          <FormulateInput
            v-if="showSubsetList.length"
            v-model="allSelectedSubset"
            type="checkbox"
            :label="allSelectedSubset ? 'Un-select All' : 'Select All'"
          />
          <div style="columns: 3">
            <FormulateInput
              v-if="showSubsetList.length"
              v-model="subsets"
              :options="showSubsetList"
              type="checkbox"
            />
          </div>

          <div
            v-if="!showSubsetList.length"
            class="bg-yellow-100 text-yellow-600 border boder-yellow-600 p-5 rounded my-2"
          >
            No subset available for this portfolio.
          </div>
        </div>
        <div>
          <div class="mb-5 mt-3">
            <WHeadingsHThree
              class="text-primary-900"
              heading="Assign to locations"
            />
          </div>
          <FormulateInput
            v-if="showProjectList.length"
            v-model="allSelectedProjects"
            type="checkbox"
            :label="allSelectedProjects ? 'Un-select All' : 'Select All'"
          />
          <div style="columns: 3">
            <FormulateInput
              v-model="projects"
              :options="projectListOptions"
              type="checkbox"
            />
          </div>

          <div
            v-if="!showProjectList.length"
            class="bg-yellow-100 text-yellow-600 border boder-yellow-600 p-5 rounded my-2"
          >
            No Project available for this portfolio.
          </div>
        </div>
        <div v-if="uploadDocumentModalTab === 2" class="my-5">
          <FormulateInput
            v-model="notSharing"
            type="checkbox"
            label="Not sharing this yet"
          />
        </div>
      </div>

      <div>
        <div class="flex justify-between">
          <div
            v-if="uploadDocumentModalTab === 2 && !documentUploading"
            class="w-25"
          >
            <WButtonsBase
              class="mr-5"
              icon="arrow-narrow-left"
              type="primary"
              @click.native="uploadDocumentModalTab = 1"
              >Back</WButtonsBase
            >
          </div>
          <div v-if="uploadDocumentModalTab === 1" class="w-25">
            <WButtonsBase
              @click.native="$parent.$parent.$refs.addSlide.toggleOpen()"
              >Cancel</WButtonsBase
            >
          </div>
          <FormulateInput
            :disabled="
              !notSharing &&
              !projects.length &&
              !subsets.length &&
              uploadDocumentModalTab === 2
            "
            :label="buttonLabel"
            type="submit"
          />
        </div>
      </div>
    </FormulateForm>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      file: [],
      documentType: '',
      versionSelected: '',
      uploadDocumentModalTab: 1,
      notSharing: false,
      documentUploading: false,
      allSelectedProjects: false,
      allSelectedSubset: false,
      projects: [],
      singleProject: null,
      subsets: [],
      featuredocumentType: '',
      type: '',
      verificationList: [],
      newDocument: null,
      v2Projects: 0,
      v2PilotProjects: 0,
      formData: {
        document: [],
        partSelected: [],
        legalTypeSelected: '',
        generalTypeSelected: '',
        featureLocationTypeSelected: '',
        verificationImpementSelected: '',
        remark: '',
      },
      documentTypeArray: {
        'Letter Of Assurance': [
          {
            label: 'Architect',
            parent: 'portfolio-scale',
            type: 'letter_of_assurance',
            value: 1,
          },
          {
            label: 'MEP',
            parent: 'portfolio-scale',
            type: 'letter_of_assurance',
            value: 2,
          },
          {
            label: 'Contractor',
            parent: 'portfolio-scale',
            type: 'letter_of_assurance',
            value: 3,
          },
          {
            label: 'Owner',
            parent: 'portfolio-scale',
            type: 'letter_of_assurance',
            value: 4,
          },
          {
            label: 'Architect & Contractor',
            parent: 'portfolio-scale',
            type: 'letter_of_assurance',
            value: 5,
          },
          {
            label: 'Architect & Owner',
            parent: 'portfolio-scale',
            type: 'letter_of_assurance',
            value: 6,
          },
          {
            label: 'Architect & MEP',
            parent: 'portfolio-scale',
            type: 'letter_of_assurance',
            value: 7,
          },
          {
            label: 'Leak Test Report and Contractor LOA',
            parent: 'portfolio-scale',
            type: 'letter_of_assurance',
            value: 8,
          },
          {
            label: 'MEP & Contractor',
            parent: 'portfolio-scale',
            type: 'letter_of_assurance',
            value: 9,
          },
          {
            label: 'Owner & MEP',
            parent: 'portfolio-scale',
            type: 'letter_of_assurance',
            value: 10,
          },
          {
            label: 'Planner',
            parent: 'portfolio-scale',
            type: 'letter_of_assurance',
            value: 11,
          },
        ],
        'Annotated Documents': [
          {
            label: 'Operations Schedule',
            parent: 'guidelines',
            type: 'annotated_documents',
            value: 1,
          },
          {
            label: 'Policy Document',
            parent: 'guidelines',
            type: 'annotated_documents',
            value: 2,
          },
          {
            label: 'Architectural Drawing',
            parent: 'guidelines',
            type: 'annotated_documents',
            value: 3,
          },
          {
            label: 'Innovation Proposal',
            parent: 'guidelines',
            type: 'annotated_documents',
            value: 4,
          },
          {
            label: 'Remediation Report',
            parent: 'guidelines',
            type: 'annotated_documents',
            value: 5,
          },
          {
            label: 'Commissioning Report',
            parent: 'guidelines',
            type: 'annotated_documents',
            value: 6,
          },
          {
            label: 'Professional Narrative',
            parent: 'guidelines',
            type: 'annotated_documents',
            value: 7,
          },
          {
            label: 'Architectural Drawing or Operations Schedule',
            parent: 'guidelines',
            type: 'annotated_documents',
            value: 8,
          },
          {
            label: 'Annotated Map',
            parent: 'guidelines',
            type: 'annotated_documents',
            value: 9,
          },
          {
            label: 'Mechanical Drawing',
            parent: 'guidelines',
            type: 'annotated_documents',
            value: 10,
          },
          {
            label: 'Architect & Contractor',
            parent: 'guidelines',
            type: 'annotated_documents',
            value: 11,
          },
          {
            label: 'Architect',
            parent: 'guidelines',
            type: 'annotated_documents',
            value: 12,
          },
          {
            label: 'Remediation Report and Policy Document',
            parent: 'guidelines',
            type: 'annotated_documents',
            value: 13,
          },
          {
            label: 'Leak Test Report',
            parent: 'guidelines',
            type: 'annotated_documents',
            value: 14,
          },
          {
            label: 'Mechanical & Architectural Drawings',
            parent: 'guidelines',
            type: 'annotated_documents',
            value: 15,
          },
          {
            label: 'Signage and Communication Materials',
            parent: 'guidelines',
            type: 'annotated_documents',
            value: 16,
          },
          {
            label: 'Daylight Simulation Report',
            parent: 'guidelines',
            type: 'annotated_documents',
            value: 17,
          },
          {
            label: 'On-going Data Report',
            parent: 'guidelines',
            type: 'annotated_documents',
            value: 18,
          },
          {
            label: 'Educational Materials',
            parent: 'guidelines',
            type: 'annotated_documents',
            value: 19,
          },
          {
            label: 'Modeling Report',
            parent: 'guidelines',
            type: 'annotated_documents',
            value: 20,
          },
          {
            label: 'Design Specifications',
            parent: 'guidelines',
            type: 'annotated_documents',
            value: 21,
          },
          {
            label: 'Survey Materials',
            parent: 'guidelines',
            type: 'annotated_documents',
            value: 22,
          },
          {
            label: 'On-going Maintenance Report',
            parent: 'guidelines',
            type: 'annotated_documents',
            value: 23,
          },
          {
            label: 'Beta feedback feature form',
            parent: 'guidelines',
            type: 'annotated_documents',
            value: 24,
          },
          {
            label: 'Innovation Form',
            parent: 'guidelines',
            type: 'annotated_documents',
            value: 25,
          },
        ],
        'On-Site Assessment': [
          {
            label: 'On-going Data Report',
            parent: 'individual-scale',
            type: 'annotated_documents',
            value: 18,
          },
          {
            label: 'Performance Test',
            parent: 'individual-scale',
            type: 'on_sites',
            value: 3,
          },
          {
            label: 'Spot Check',
            parent: 'individual-scale',
            type: 'on_sites',
            value: 1,
          },
          {
            label: 'Visual Inspection',
            parent: 'individual-scale',
            type: 'on_sites',
            value: 2,
          },
          {
            label: 'Spot Measurement',
            parent: 'individual-scale',
            type: 'on_sites',
            value: 4,
          },
        ],
      },
      disableVersionSelection: false,
      versions: [
        { label: 'WELL v2-pilot', value: 'v2-pilot' },
        { label: 'WELL v2', value: 'v2' },
      ],
    }
  },
  computed: {
    ...mapState({
      subsetProjectsList: (state) => state.portfolio.subsetProjects,
      subsetList: (state) => state.portfolio.subsetList,
      featureandParts: (state) => state.shared.featureandParts,
      legalTypes: (state) => state.shared.legalTypes,
      generalTypes: (state) => state.shared.generalTypes,
      showFeatures: (state) => state.shared.showFeatures,
      portfolio: (state) => state.portfolio.portfolio,
      standardVersion: (state) => state.project.standards,
      verificationImpementOptions: (state) =>
        state.shared.verificationImpementOptions,
      documentsList: (state) => state.portfolio.documentsList,
    }),
    subsetProjects() {
      if (this.subsetProjectsList && this.subsetProjectsList.length) {
        return this.subsetProjectsList.filter(
          (a) => a.type === this.versionSelected
        )
      } else {
        return []
      }
    },
    showProjectList() {
      const value = 1
      const start = (value - 1) * 20
      const end =
        start + 20 <= this.subsetProjects.length
          ? start + 20
          : this.subsetProjects.length
      return this.subsetProjects.slice(start, end)
    },
    projectListOptions() {
      return this.subsetProjects.map((el) => {
        return {
          label: el.label,
          value: el.value,
        }
      })
    },
    showSubsetList() {
      const value = 1
      const start = (value - 1) * 20
      const end =
        start + 20 <= this.subsetList.length
          ? start + 20
          : this.subsetList.length
      return this.subsetList.slice(start, end)
    },
    buttonLabel() {
      if (this.uploadDocumentModalTab === 1) {
        return this.uploadButtonText
      } else if (this.uploadDocumentModalTab === 2 && !this.documentUploading) {
        return 'Submit'
      } else if (this.uploadDocumentModalTab === 2 && this.documentUploading) {
        return 'Uploading'
      }

      return ''
    },
    uploadButtonText() {
      let text = 'Upload'
      if (this.formData.featureLocationTypeSelected === 'multiple') {
        text = 'Next'
      }
      return text
    },
    subsetList() {
      return this.$store.state.portfolio.subsetList.map((element) => {
        return {
          label: element.name,
          value: element.id,
          project_ids: element.project_ids,
        }
      })
    },
    featureLocationOptions() {
      const options = JSON.parse(
        JSON.stringify(this.$store.state.portfolio.featureLocationOptions)
      )
      options[0].label = `Single location`
      options[1].label = `Multiple locations or subsets`
      if (this.versionSelected && this.versionSelected === 'v2') {
        if (this.v2Projects <= 1) {
          options[2].label = `All (${this.v2Projects} location)`
        } else {
          options[2].label = `All (${this.v2Projects} locations)`
        }
      } else if (this.versionSelected && this.versionSelected === 'v2-pilot') {
        if (this.v2PilotProjects <= 1) {
          options[2].label = `All (${this.v2PilotProjects} location)`
        } else {
          options[2].label = `All (${this.v2PilotProjects} locations)`
        }
      } else {
        options[2].label = 'All  locations'
      }
      return options
    },
    documentTypeArrayOption() {
      const options = []
      for (const key in this.documentTypeArray) {
        this.documentTypeArray[key].map((x) => {
          options.push({
            label: x.label,
            value: x.value,
            type: x.type,
          })
          return options
        })
      }
      return options
    },
    verificationListOption() {
      const options = []

      for (let i = 0; i < this.verificationList.length; i++) {
        const option = {
          value: this.verificationList[i].id,
          label: this.verificationList[i].name,
        }
        options.push(option)
      }

      return options
    },
    featureandPartsOption() {
      const options = []
      for (let i = 0; i < this.featureandParts.length; i++) {
        const option = {
          value: this.featureandParts[i].parts[0].id,
          label: this.featureandParts[i].parts[0].feature_name,
        }
        options.push(option)
      }
      return options
    },
  },
  watch: {
    type(newvalue) {
      if (newvalue === 'Individual Scale') {
        this.formData.featureLocationTypeSelected = 'single'
      } else {
        this.formData.featureLocationTypeSelected = ''
      }
    },
    versionSelected(newVal, oldVal) {
      if (newVal && (newVal === 'v2' || newVal === 'v2-pilot')) {
        return true
      } else {
        return false
      }
    },
    featuredocumentType(value) {
      if (this.versionSelected) {
        this.selectVersion(this.versionSelected)
      }
    },

    documentType(newVal) {
      if (newVal && (newVal === 'feature' || newVal === 'audit')) {
        this.$store.dispatch('shared/setShowFeatures', true)
      } else {
        this.$store.dispatch('shared/setShowFeatures', false)
      }
    },
    allSelectedSubset(value) {
      if (value) {
        this.subsets = this.showSubsetList.map((element) => {
          return element.value
        })
      } else {
        this.subsets = []
      }
    },
    allSelectedProjects(value) {
      if (value) {
        this.projects = this.subsetProjects.map((element) => {
          return element.value
        })
      } else {
        this.projects = []
      }
    },
    subsets(newValue, oldValue) {
      let newSubset = []
      if (newValue.length) {
        if (!oldValue.length) {
          newSubset = newValue
        } else {
          newValue.forEach((element) => {
            const value = oldValue.filter((a) => a === element)
            if (!value.length) {
              newSubset.push(element)
            }
          })
        }
      }
      const oldSubset = []
      if (oldValue.length) {
        if (oldValue.length) {
          oldValue.forEach((element) => {
            const value = newValue.filter((a) => a === element)
            if (!value.length) {
              oldSubset.push(element)
            }
          })
        }
      }
      if (newSubset.length) {
        newSubset.forEach((element) => {
          const subset = this.subsetList.filter((a) => a.value === element)[0]
          subset.project_ids.forEach((project) => {
            if (this.projects.filter((a) => a === project).length === 0) {
              this.projects.push(project)
            }
          })
        })
      }
      if (oldSubset.length) {
        oldSubset.forEach((element) => {
          const subset = this.subsetList.filter((a) => a.value === element)[0]
          subset.project_ids.forEach((project) => {
            if (this.projects.filter((a) => a === project).length !== 0) {
              const index = this.projects.indexOf(project)
              this.projects.splice(index, 1)
            }
          })
        })
      }
    },
  },
  async mounted() {
    await this.$store.dispatch('project/getStandards')
    await this.getVerificationList()
    this.getPortfolioProjectsCount()
    await this.$store.dispatch('portfolio/getSubsetList', this.portfolio.id)
  },
  beforeDestroy() {
    this.documentType = 'general'
    this.clearAll()
  },

  methods: {
    handleFileChange(event) {
      const fileExtension = event.target.files[0].name.split('.').pop()
      if (fileExtension === 'zip' || fileExtension === 'exe') {
        alert('This file type is not allowed.')
      } else {
        this.newDocument = event.target.files[0]
      }
    },
    getVerificationList() {
      this.$axios.get('api/verifications').then((response) => {
        this.verificationList = response.data
      })
    },
    getPortfolioProjectsCount() {
      this.$axios
        .get('api/portfolio/' + this.portfolio.id + '/projects/count')
        .then((response) => {
          const v2 = response.data.v2
          const v2Pilot = response.data['v2-pilot']
          this.v2Projects = response.data.v2
          this.v2PilotProjects = response.data['v2-pilot']
          if (v2 === 0) {
            this.disableVersionSelection = true
            this.versionSelected = this.versions[0].value
          } else if (v2Pilot === 0) {
            this.disableVersionSelection = true
            this.versionSelected = this.versions[1].value
          }
          if (!v2 && !v2Pilot) {
            this.disableVersionSelection = false
            this.versionSelected = ''
          }
        })
    },

    selectVersion(selectedOption) {
      const payload = {
        on_sites: [],
        annotated_documents: [],
        letter_of_assurances: [],
        verifications: [],
      }
      if (
        this.featuredocumentType &&
        Object.prototype.hasOwnProperty.call(this.featuredocumentType, 'value')
      ) {
        if (this.featuredocumentType.type === 'letter_of_assurance') {
          payload.letter_of_assurances = [this.featuredocumentType.value]
        }
        if (this.featuredocumentType.type === 'annotated_documents') {
          if (this.featuredocumentType.value) {
            payload.annotated_documents = [this.featuredocumentType.value]
          }
        }
        if (this.featuredocumentType.type === 'on_sites') {
          payload.on_sites = [this.featuredocumentType.value]
        }
      }
      if (this.featuredocumentType && this.versionSelected === 'v2') {
        payload.verifications = [this.featuredocumentType.value]
      }
      if (selectedOption) {
        let portfolioVerisonType = this.standardVersion.filter(
          (a) => a.id === this.portfolio.applicable_version_id
        )
        if (portfolioVerisonType.length) {
          portfolioVerisonType = portfolioVerisonType[0].type
        }
        if (portfolioVerisonType === this.versionSelected) {
          this.$store.dispatch('shared/getFeaturesandPartswithFilters', {
            filters: payload,
            id: this.portfolio.applicable_version_id,
          })
        } else {
          let getFeaturesOfVersion = this.standardVersion.filter(
            (a) => a.type === selectedOption && a.language[0].code === 'en'
          )
          getFeaturesOfVersion =
            getFeaturesOfVersion[getFeaturesOfVersion.length - 1]
          this.$store.dispatch('shared/getFeaturesandPartswithFilters', {
            filters: payload,
            id: getFeaturesOfVersion.id,
          })
        }
      }
    },
    async uploadDocument() {
      const data = { ...this.formData }

      data.document = data.document.map(function (file) {
        const fileInfo = { link_s3: file.url }
        return fileInfo
      })

      data.documentable_sub_type = this.documentType

      if (this.documentType === 'legal' || this.documentType === 'general') {
        if (this.documentType === 'legal') {
          data.type = this.formData.legalTypeSelected
        } else {
          data.type = this.formData.generalTypeSelected
        }

        data.link_s3 = data.document[0].link_s3

        await this.$store.dispatch('shared/getuploadDocument', {
          scorecardId: this.portfolio.id,
          data,
        })

        this.$store.dispatch('portfolio/getDocumentsList', {
          id: this.portfolio.id,
          page: 1,
          name: '',
        })
        this.$parent.$parent.$refs.addSlide.toggleOpen()
      } else {
        if (!this.newDocument) {
          this.$refs.alert.showAlert('error', 'Please select a document.')
          return false
        }
        if (!this.formData.partSelected.length) {
          this.$refs.alert.showAlert(
            'error',
            'There is no parts for the selected verification.'
          )
          return false
        }
        if (
          this.newDocument &&
          (this.newDocument.name.split('.').pop() === 'zip' ||
            this.newDocument.name.split('.').pop() === 'exe')
        ) {
          this.$refs.alert.showAlert(
            'error',
            'You can not upload a zip/exe file.'
          )
          return false
        }
        if (
          this.uploadButtonText === 'Next' &&
          this.uploadDocumentModalTab !== 2
        ) {
          this.uploadDocumentModalTab = 2
          return true
        }
        const data = new FormData()
        data.append(
          'type',
          this.documentType === 'audit' ? 'Audit-Document' : ''
        )
        data.append('file', this.newDocument)
        data.append('phase', 'Register')
        data.append('stage', this.formData.verificationImpementSelected)
        if (this.featuredocumentType && this.versionSelected === 'v2-pilot') {
          data.append(
            'part_doc_type',
            this.featuredocumentType ? this.featuredocumentType.label : ''
          )
        } else if (this.featuredocumentType && this.versionSelected === 'v2') {
          data.append(
            'part_doc_type',
            this.featuredocumentType
              ? this.verificationListOption.filter(
                  (a) => a.value === parseInt(this.featuredocumentType.value)
                )[0].label
              : ''
          )
        }

        if (this.formData.partSelected.length) {
          this.formData.partSelected.forEach((e) => {
            data.append('part_ids[]', e.id)
          })
        } else {
          data.append('part_ids[]', [])
        }
        const singleProject =
          this.formData.featureLocationTypeSelected === 'single'
        if (this.projects && this.projects.length && !singleProject) {
          this.projects.map((element) => {
            return data.append('project_ids[]', element)
          })
        }
        if (singleProject && this.singleProject) {
          data.append('project_ids[]', this.singleProject)
        }
        if (this.formData.featureLocationTypeSelected === 'all') {
          this.subsetProjects.map((element) => {
            return data.append('project_ids[]', element.value)
          })
        }
        if (this.subsets && this.subsets.length) {
          this.subsets.map((element) => {
            return data.append('portfolio_subset_ids[]', element)
          })
        }
        await this.$store.dispatch('shared/uploadScorecardDocument', {
          scorecardId: this.portfolio.scorecard_id,
          data,
        })
        this.$parent.$parent.$refs.addSlide.toggleOpen()
        this.$parent.$parent.getScorcard()
        this.$parent.$parent.getScorcardAudit()
      }
      await this.$store.dispatch('portfolio/getDocumentsList', {
        id: this.portfolio.id,
        page: this.documentsList.current_page,
        name: this.$parent.$parent.documentSearch,
      })
    },
    clearAll() {
      this.documentType = 'general'
      this.formData.remark = ''
      this.type = ''
      this.formData.verificationImpementSelected = ''
      this.formData.featureLocationTypeSelected = ''
      this.formData.legalTypeSelected = ''
      this.formData.generalTypeSelected = ''
      this.formData.partSelected = ''
      this.featuredocumentType = ''
    },
  },
}
</script>
