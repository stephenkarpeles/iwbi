<template>
  <div>
    <WFeedbackAlert ref="alert" />
    <div class="space-y-6 max-w-4xl mx-auto">
      <WHeadingsHTwo class="mb-2" heading="Upload documents" />
    </div>
    <FormulateForm
      class="space-y-6 max-w-4xl mx-auto my-10 border rounded-md p-5"
      @submit="uploaddocument"
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
          <label for="featureLocationTypeSelected"
            >Does this verification apply to a single location, multiple or all
            locations? *
            <span
              v-if="subsetProjects.length === 0"
              class="text-red-400 text-sm inline-block mt-1 mb-2"
            >
              * Uploaded audit and verification documents for a WELL feature
              must be tagged to one or more locations before you submit for
              review. We suggest you upload locations prior to document upload.
            </span></label
          >
          <FormulateInput
            v-model="formData.featureLocationTypeSelected"
            :options="featureLocationOptions"
            name="featureLocationTypeSelected"
            type="radio"
            validation="required"
          />
        </div>
        <div class="mb-5">
          <FormulateInput
            v-model="featuredocumentType"
            type="select"
            label="Verification method"
            placeholder="Select option"
            :options="verificationListOption"
            @change="getPartList"
          />
        </div>
        <div class="mb-5">
          <label
            for="partSelected"
            class="w-full text-sm font-bold leading-5 text-gray-700 sm:mt-px sm:pt-2"
            >Which parts are contained in your verification document? *</label
          >
          <multiselect
            v-if="featureandPartsOption.length"
            v-model="formData.partSelected"
            :open-direction="'bottom'"
            :multiple="true"
            :searchable="true"
            :hide-selected="false"
            :allow-empty="true"
            track-by="value"
            :show-labels="false"
            name="partSelected"
            :options="featureandPartsOption"
            placeholder="Select option"
            label="label"
            validation="required"
          ></multiselect>
          <p
            v-if="!featureandPartsOption.length && featuredocumentType"
            class="mt-2 text-sm text-red-600"
          >
            No parts available for the selected verification
          </p>
        </div>
        <div
          v-if="
            (documentType === 'audit' || documentType === 'feature') &&
            formData.featureLocationTypeSelected === 'single'
          "
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
          :upload-path="`shared-workspaces/${sharedWorkspace.portfolio_number}/documents/`"
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
              class="mr-5"
              icon="arrow-narrow-left"
              type="primary"
              @click.native="uploadDocumentModalTab = 1"
              >Back</WButtonsBase
            >
          </div>
          <div v-if="uploadDocumentModalTab === 1" class="w-25">
            <WButtonsBase @click.native="$parent.addDocument = false"
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
            type="submit"
          >
            <div v-if="uploadDocumentModalTab === 1">
              {{ uploadButtonText }}
            </div>
            <div>
              <div v-if="uploadDocumentModalTab === 2 && !documentUploading">
                Submit
              </div>
              <div v-if="uploadDocumentModalTab === 2 && documentUploading">
                Uploading
              </div>
            </div>
          </FormulateInput>
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
      formData: {
        document: [],
        partSelected: [],
        legalTypeSelected: '',
        generalTypeSelected: '',
        featureLocationTypeSelected: '',
        verificationImpementSelected: '',
        remark: '',
      },
    }
  },
  computed: {
    ...mapState({
      subsetProjects: (state) => state.shared.subsetProjects,
      featureandParts: (state) => state.shared.featureandParts,
      legalTypes: (state) => state.shared.legalTypes,
      generalTypes: (state) => state.shared.generalTypes,
      showFeatures: (state) => state.shared.showFeatures,
      sharedWorkspace: (state) => state.shared.sharedWorkspace,
      verificationImpementOptions: (state) =>
        state.shared.verificationImpementOptions,
    }),
    showProjectList() {
      const value = this.paginateProject.current_page
      const start = (value - 1) * 20
      const end =
        start + 20 <= this.subsetProjects.length
          ? start + 20
          : this.subsetProjects.length
      return this.subsetProjects.slice(start, end)
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
      if (this.formData.featureLocationTypeSelected === 'multiple') {
        text = 'Next'
      }
      return text
    },
    subsetList() {
      return this.$store.state.shared.subsetList.map((element) => {
        return {
          label: element.name,
          value: element.id,
          project_ids: element.project_ids,
        }
      })
    },
    featureLocationOptions() {
      const options = this.$store.state.shared.featureLocationOptions
      options[options.length - 1].label =
        'All location (' + this.subsetProjects.length + ')'
      return options
    },
    verificationListOption() {
      const options = []

      for (let i = 0; i < this.verificationList.length; i++) {
        if (this.verificationList[i].name !== 'On-going Report') {
          const option = {
            value: this.verificationList[i].id,
            label: this.verificationList[i].name,
          }
          options.push(option)
        }
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
    this.getVerificationList()
    await this.$store.dispatch('shared/getSharedSubsetProjects', {})
    await this.$store.dispatch('shared/getSubsetList')
    this.setPaginateSubset()
    this.setPaginateProject()
    this.getPartList()
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
    getPartList(value) {
      this.formData.partSelected = []
      const payload = {
        verifications: [],
      }
      if (value) {
        this.featuredocumentType = value.target.value
        if (value.target.value) {
          payload.verifications.push(value.target.value)
        }
      }
      this.$store.dispatch('shared/getFeaturesandPartswithFilters', {
        filters: payload,
        id: this.sharedWorkspace.hsr_scorecard_version_id,
      })
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
    getVerificationList() {
      this.$axios.get('api/verifications').then((response) => {
        this.verificationList = response.data
      })
    },
    async uploaddocument() {
      if (this.documentType === 'legal' || this.documentType === 'general') {
        const data = { ...this.formData }
        data.document = data.document.map(function (file) {
          const fileInfo = { link_s3: file.url }
          return fileInfo
        })
        data.link_s3 = data.document[0].link_s3
        if (this.documentType === 'legal' && this.formData.legalTypeSelected) {
          data.type = this.formData.legalTypeSelected
        }
        if (
          this.documentType === 'general' &&
          this.formData.generalTypeSelected
        ) {
          data.type = this.formData.generalTypeSelected
        }
        await this.$store.dispatch('shared/getuploadDocument', {
          scorecardId: this.sharedWorkspace.id,
          data,
        })
        this.$store.dispatch('shared/getDocumentList', {
          id: this.sharedWorkspace.id,
          page: 1,
          name: '',
        })
        this.$parent.addDocument = false
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
        data.append('stage', 'Implementation')
        if (this.featuredocumentType) {
          data.append(
            'part_doc_type',
            this.featuredocumentType
              ? this.verificationListOption.filter(
                  (a) =>
                    parseInt(a.value) === parseInt(this.featuredocumentType)
                )[0].label
              : ''
          )
        }

        if (this.formData.partSelected.length) {
          this.formData.partSelected.forEach((e) => {
            data.append('part_ids[]', e.value)
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
          scorecardId: this.sharedWorkspace.hsr_scorecard_id,
          data,
        })
        this.$parent.addDocument = false
        this.$parent.getScorcard()
        this.$parent.getScorcardAudit()
      }
    },
  },
}
</script>
