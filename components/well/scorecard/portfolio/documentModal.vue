<template>
  <div>
    <WFeedbackAlert ref="alert"></WFeedbackAlert>
    <FormulateForm
      v-if="!loading"
      class="space-y-6 max-w-4xl mx-auto mb-5 border rounded-md p-5"
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
            { label: 'Upload an audit document', value: 'audit' },
            {
              label: 'Upload verification of a WELL feature',
              value: 'feature',
            },
          ]"
        />
      </div>
      <div v-if="showFeatures && uploadDocumentModalTab === 1">
        <div class="mb-5">
          <FormulateInput
            :key="forceRemount"
            v-model="formData.featureLocationTypeSelected"
            :options="featureLocationOptions"
            label="Does this verification apply to a single location, multiple or
                all locations?"
            type="radio"
          />
        </div>
        <!-- <div class="mb-5">
          <FormulateInput
            v-model="formData.verificationImpementSelected"
            :options="verificationImpementOptions"
            label="Does this verification reflect implemented guidelines,
                policies, or features?*"
            type="radio"
            validation="required"
          />
        </div> -->
        <div class="mb-5">
          <FormulateInput
            v-model="formData.featuredocumentType"
            type="select"
            name="legalTypes"
            label="Verification method *"
            placeholder="Select option"
            :options="verificationListOption"
          />
        </div>
        <div
          v-if="formData.featureLocationTypeSelected === 'single'"
          class="mb-5"
        >
          <FormulateInput
            v-model="singleProjects"
            :options="subsetProjects"
            placeholder="select location"
            label="Which of your location share this verification
                  document?"
            type="select"
          />
        </div>
      </div>
      <div v-if="uploadDocumentModalTab === 1" class="mb-5">
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
      <div v-if="uploadDocumentModalTab === 2">
        <div>
          <div class="mb-5">
            <WHeadingsHThree heading="Assign to subsets" />
          </div>
          <FormulateInput
            v-if="subsetList.length"
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
          <FormInputsPagination
            v-if="showSubsetList.length"
            :pagination="paginateSubset"
            :offset="3"
            @paginate="setPaginateSubset"
          />
          <div
            v-if="!subsetList.length"
            class="bg-yellow-100 text-yellow-600 border boder-yellow-600 p-5 rounded my-2"
          >
            No subset available for this shared workspace.
          </div>
        </div>
        <div>
          <div class="mb-5">
            <WHeadingsHThree heading="Assign to locations" />
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
              :options="showProjectList"
              type="checkbox"
            />
          </div>
          <FormInputsPagination
            v-if="showProjectList.length"
            :pagination="paginateProject"
            :offset="3"
            @paginate="setPaginateProject"
          />
          <div
            v-if="!showProjectList.length"
            class="bg-yellow-100 text-yellow-600 border boder-yellow-600 p-5 rounded my-2"
          >
            No locations available for this shared workspace.
          </div>
        </div>
        <div v-if="uploadDocumentModalTab === 2" class="my-5 w-25">
          <FormulateInput
            v-model="notSharing"
            type="checkbox"
            label="Not sharing this yet"
          />
        </div>
      </div>
      <div>
        <div class="flex justify-between">
          <div v-if="uploadDocumentModalTab === 2 && !documentUploading">
            <WButtonsBase
              icon="arrow-narrow-left"
              type="primary"
              @click.native="uploadDocumentModalTab = 1"
              >Back</WButtonsBase
            >
          </div>
          <div>
            <FormulateInput
              class="mr-5"
              type="submit"
              :label="uploadButtonText"
              :disabled="
                !subsets.length &&
                !projects.length &&
                !notSharing &&
                uploadDocumentModalTab === 2
              "
            >
            </FormulateInput>
          </div>
        </div>
      </div>
    </FormulateForm>
    <div v-else class="mx-auto text-center">
      <WLoadingSpinner class="mx-auto" />
      <div class="mt-3 text-primary-600">Loading...</div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  props: {
    part: {
      type: Object,
      default: () => {
        return {}
      },
    },
    module: {
      type: Object,
      required: false,
      default: () => {},
    },
    moduleType: {
      type: String,
      default: 'project',
    },
  },
  data() {
    return {
      newDocument: null,
      forceRemount: 0,
      loading: false,
      documentType: '',
      uploadDocumentModalTab: 1,
      currentSubsetPage: 1,
      currentProjectPage: 1,
      notSharing: false,
      documentUploading: false,
      allSelectedProjects: false,
      allSelectedSubset: false,
      projects: [],
      singleProjects: '',
      subsets: [],
      type: '',
      verificationList: [],
      verificationListOption: [],
      formData: {
        partSelected: '',
        legalTypeSelected: '',
        generalTypeSelected: '',
        featureLocationTypeSelected: '',
        verificationImpementSelected: '',
        featuredocumentType: '',
      },
      paginateProject: {
        total: 1,
        per_page: 20,
        current_page: 1,
        last_page: 1,
        from: 1,
        to: 1,
      },
      paginateSubset: {
        total: 1,
        per_page: 20,
        current_page: 1,
        last_page: 1,
        from: 1,
        to: 1,
      },
    }
  },
  computed: {
    ...mapState({
      featureandParts: (state) => state.shared.featureandParts,
      hsrId: (state) => state.portfolio.hsr_scorecard_id,
      legalTypes: (state) => state.shared.legalTypes,
      generalTypes: (state) => state.shared.generalTypes,
      showFeatures: (state) => state.shared.showFeatures,
      featureLocationOptions: (state) => state.shared.featureLocationOptions,
      verificationImpementOptions: (state) =>
        state.shared.verificationImpementOptions,
    }),
    subsetProjects() {
      if (this.moduleType === 'portfolio') {
        return this.$store.state.portfolio.subsetProjects
      } else {
        return this.$store.state.shared.subsetProjects
      }
    },
    subsetList() {
      const list =
        this.moduleType === 'portfolio'
          ? this.$store.state.portfolio.subsetList
          : this.$store.state.shared.subsetList
      return list.map((element) => {
        return {
          label: element.name,
          value: element.id,
          project_ids: element.project_ids,
        }
      })
    },
    featureLocationOptions() {
      const options =
        this.moduleType === 'portfolio'
          ? this.$store.state.portfolio.featureLocationOptions
          : this.$store.state.shared.featureLocationOptions
      if (this.moduleType === 'portfolio') {
        options[0].label = 'Single location'
        options[1].label = 'Multiple locations or subsets'
      }
      options[options.length - 1].label =
        'All location (' + this.subsetProjects.length + ')'
      return options
    },
    showProjectList() {
      const value = this.paginateProject.current_page
      const start = (value - 1) * 20
      const end =
        start + 20 <= this.subsetProjects.length
          ? start + 20
          : this.subsetProjects.length
      const projects = this.subsetProjects.slice(start, end)
      return projects.map((el) => {
        return {
          label: el.label,
          value: el.value,
        }
      })
    },
    showSubsetList() {
      const value = this.paginateSubset.current_page
      const start = (value - 1) * 20
      const end =
        start + 20 <= this.subsetList.length
          ? start + 20
          : this.subsetList.length
      return this.subsetList.slice(start, end)
    },
    uploadButtonText() {
      let text = 'Upload'
      if (
        this.formData.featureLocationTypeSelected === 'multiple' &&
        this.uploadDocumentModalTab === 1
      ) {
        text = 'Next'
      }
      return text
    },
  },
  watch: {
    allSelectedProjects(value) {
      if (value) {
        this.projects = this.subsetProjects.map((element) => {
          return element.value
        })
      } else {
        this.projects = []
      }
    },
    allSelectedSubset(newValue) {
      if (newValue) {
        this.subsets = this.subsetList.map((element) => {
          return element.value
        })
      } else {
        this.subsets = []
      }
    },
    'formData.featureLocationTypeSelected'(value) {
      this.projects = []
      this.singleProjects = ''
      if (value === 'all') {
        this.projects = this.subsetProjects.map((element) => {
          return element.value
        })
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
    this.verificationListOption = []
    this.loading = true
    this.$store.dispatch('shared/setShowFeatures', true)
    if (this.module.type === 'v2-pilot' && this.moduleType === 'portfolio') {
      const loa = this.part.letter_of_assurances
      const onSite = this.part.on_sites
      const annotatedDocuments = this.part.annotated_documents
      const verficiations = [...loa, ...onSite, ...annotatedDocuments]
      verficiations.forEach((verification) => {
        if (
          this.verificationListOption.filter(
            (a) => a.value === verification.name
          ).length === 0
        ) {
          this.verificationListOption.push({
            label: verification.name,
            value: verification.name,
          })
        }
      })
    } else {
      this.part.subParts.forEach((subpart) => {
        subpart.options.forEach((option) => {
          option.verifications.forEach((verification) => {
            if (
              this.verificationListOption.filter(
                (a) => a.value === verification.name
              ).length === 0
            ) {
              this.verificationListOption.push({
                label: verification.name,
                value: verification.name,
              })
            }
          })
        })
      })
    }

    if (this.moduleType === 'portfolio') {
      await this.$store.dispatch('portfolio/getPortfolioProjects', {
        paginate: 'no',
      })
      await this.$store.dispatch('portfolio/getSubsetList')
    } else {
      await this.$store.dispatch('shared/getSharedSubsetProjects', {})
      await this.$store.dispatch('shared/getSubsetList')
    }

    this.forceRemount++
    this.loading = false
  },
  methods: {
    reset() {
      this.newDocument = null
      this.documentType = ''
      this.uploadDocumentModalTab = 1
      this.notSharing = false
      this.documentUploading = false
      this.allSelectedProjects = false
      this.allSelectedSubset = false
      this.projects = []
      this.singleProjects = ''
      this.subsets = []
      this.type = ''
      this.verificationList = []
      this.formData = {
        partSelected: '',
        legalTypeSelected: '',
        generalTypeSelected: '',
        featureLocationTypeSelected: '',
        verificationImpementSelected: '',
        featuredocumentType: '',
      }
    },
    handleFileChange(event) {
      this.newDocument = event.target.files[0]
    },
    setPaginateSubset() {
      const value = this.paginateSubset.current_page
      const start = (value - 1) * 20 === 0 ? 1 : (value - 1) * 20
      const end =
        start + 20 <= this.subsetList.length
          ? start + 20
          : this.subsetList.length
      const lastPage =
        this.subsetList.length % 20 === 0
          ? this.subsetList.length / 20
          : this.subsetList.length / 20 + 1

      this.paginateSubset = {
        total: this.subsetList.length,
        per_page: 20,
        current_page: value,
        last_page: parseInt(lastPage),
        from: start,
        to: end,
      }
    },
    setPaginateProject() {
      const value = this.paginateProject.current_page
      const start = (value - 1) * 20 === 0 ? 1 : (value - 1) * 20 + 1
      const lastPage =
        this.subsetProjects.length % 20 === 0
          ? this.subsetProjects.length / 20
          : this.subsetProjects.length / 20 + 1
      const end =
        start + 20 <= this.subsetProjects.length
          ? start + 20
          : this.subsetProjects.length
      this.paginateProject = {
        total: this.subsetProjects.length,
        per_page: 20,
        current_page: value,
        last_page: parseInt(lastPage),
        from: start,
        to: end,
      }
    },
    uploadDocument() {
      if (!this.newDocument) {
        this.$refs.alert.showAlert('error', 'Please select file')
      }
      if (this.uploadButtonText === 'Next') {
        this.uploadDocumentModalTab = 2
        this.setPaginateSubset()
        this.setPaginateProject()
        return true
      }
      const data = new FormData()
      data.append('file', this.newDocument)

      if (this.documentType === 'audit') {
        data.append('type', 'Audit-Document')
      }
      data.append('phase', 'Register')

      data.append(
        'stage',
        this.formData.verificationImpementSelected
          ? this.formData.verificationImpementSelected
          : 'Implementation'
      )
      data.append('part_doc_type', this.formData.featuredocumentType)
      data.append('part_ids[]', this.part.id)

      if (
        this.formData.featureLocationTypeSelected === 'single' &&
        this.singleProjects
      ) {
        data.append('project_ids[]', this.singleProjects)
      } else if (this.projects.length) {
        this.projects.forEach((element) => {
          data.append('project_ids[]', element)
        })
      }

      if (this.subsets.length) {
        this.subsets.forEach((element) => {
          data.append('portfolio_subset_ids[]', element)
        })
      }

      const id =
        this.moduleType === 'hsr'
          ? this.module.hsr_scorecard_id
          : this.hsrId
          ? this.hsrId
          : this.module.scorecard_id

      this.$store
        .dispatch('shared/uploadScorecardDocument', {
          scorecardId: id,
          data,
        })
        .then((response) => {
          this.reset()
          this.$emit('get-documents')
        })
        .catch((response) => {
          this.$refs.alert.showAlert('error', response.data.message)
        })
    },
  },
}
</script>
