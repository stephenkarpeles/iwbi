<template>
  <div class="lg:max-h-96 lg:h-[600px] overflow-x-auto overflow-y-auto pr-2">
    <div :class="mode === 'locations' && 'hidden'" class="mr-5">
      <div>
        <div class="text-gray-600 flex flex-col">
          <span class="text-lg font-semibold">Document information</span>
        </div>

        <div class="py-6 space-y-4 border-b-2 border-gray-200">
          <div class="text-gray-600 flex flex-col">
            <span class="text-lg font-semibold">Select document type</span>
          </div>
          <FormulateInput
            v-model="docType"
            :options="typeOptions"
            type="select"
          />
        </div>
      </div>
      <div v-if="docType !== 'feature' && docType !== 'audit'">
        <div class="py-4 space-y-4">
          <div class="text-gray-600 flex flex-col">
            <span class="text-lg font-semibold">File upload</span>
          </div>
          <FormulateInput
            v-model="formData.document"
            :value="formData.document"
            type="fileupload"
            :upload-path="`project/${project.project_number}/documents/`"
            mime-types=""
            validation="required"
          />
        </div>
      </div>
      <div v-else>
        <div class="py-6 space-y-4 border-b-2 border-gray-200">
          <div class="text-gray-600 flex flex-col">
            <span class="text-lg font-semibold"
              >Select verification method</span
            >
          </div>
          <div v-if="!loading">
            <multiselect
              v-model="verifMethod"
              open-direction="bottom"
              :multiple="false"
              :searchable="false"
              :hide-selected="false"
              :allow-empty="true"
              :show-labels="false"
              label="label"
              placeholder="Select verification"
              track-by="value"
              name="verification"
              validation="requird"
              :options="verificationOptions"
            />
          </div>
          <div v-else>
            <div class="mx-auto text-center">
              <WLoadingSpinner class="mx-auto" />
            </div>
          </div>
        </div>
        <div
          v-if="showPeriod"
          class="py-6 space-y-4 border-b-2 border-gray-200"
        >
          <div class="text-gray-600 flex flex-col">
            <span class="text-lg font-semibold">Period</span>
          </div>
          <FormulateInput
            v-model="formData.period"
            :options="[
              { label: 'Year 1 reporting', value: 'Year 1 reporting' },
              { label: 'Year 2 reporting', value: 'Year 2 reporting' },
              { label: 'Year 3 reporting', value: 'Year 3 reporting' },
            ]"
            type="select"
            :multiple="false"
            :searchable="false"
            validation="required"
          />
        </div>
        <div
          v-if="verifMethod"
          class="py-6 space-y-4 border-b-2 border-gray-200"
        >
          <div class="text-gray-600 flex flex-col">
            <span class="text-lg font-semibold">Selected feature part(s)</span>
            <span v-if="!docType === 'audit'" class="pt-1"
              >Add a feature part that is represented in your document. You may
              add as many feature parts as needed.</span
            >
            <span v-else class="pt-1"
              >Add a feature part that is represented in your document.</span
            >
          </div>
          <ProjectPortfolioDocFeatureSelectScreen
            ref="featureSelect"
            :is-audit="docType === 'audit'"
            :verification="verifMethod"
            @getOptionList="getOptionList"
            @removeFeature="removeFeature"
          />
        </div>

        <div class="py-6 space-y-4 border-b-2 border-t-2 border-gray-200">
          <div class="text-gray-600 flex flex-col">
            <span class="text-lg font-semibold">File upload</span>
          </div>

          <div>
            <div>
              <label
                class="text-sm font-medium leading-5 text-primary-800 sm:mt-px sm:pt-2"
              >
                Attach Document
              </label>
            </div>
            <div
              v-if="!newPartDocument"
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
                    {{ newPartDocument.name }}
                  </span>
                  <button
                    class="right-0 absolute mr-3 text-danger-500"
                    type="button"
                    @click="newPartDocument = null"
                  >
                    remove
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div
          v-if="docType === 'feature' || docType === 'audit'"
          class="py-6 space-y-4"
        >
          <div class="text-gray-600 flex flex-col">
            <span class="text-lg font-semibold">Add a note</span>
            <span class="text-sm pt-2 font-normal"
              >Add additional notes or context to this document that you'd like
              to share with your review team.</span
            >
          </div>
          <FormulateInput v-model="formData.note" type="textarea" />
        </div>
      </div>
      <div
        class="flex items-center justify-between sticky bottom-0 bg-white border-t border-gray-200 py-2"
      >
        <div>
          <FormulateInput
            v-if="docType === 'feature' || docType === 'audit'"
            v-model="formData.stage"
            label="This is an intent stage document"
            type="checkbox"
          />
        </div>
        <div v-if="!errorLocation">
          <WButtonsBase @click.native="uploadDocument(), (uploading = true)">
            <WLoadingSpinner v-if="uploading" type="button" class="mx-auto" />
            <span v-else>Upload</span></WButtonsBase
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    modeName: {
      type: String,
      required: false,
      default: '',
    },
  },
  data() {
    return {
      uploading: false,
      newPartDocument: null,
      verifications: null,
      part: null,
      option: null,
      docType: 'general',
      verifMethod: null,
      formData: {
        document: [],
      },
      scorecard_part_id: null,
      mode: '',
      stage: false,
      loading: false,
      isLocation: false,
      errorLocation: false,
      forceReMount: 0,
      documentSearch: '',
    }
  },
  computed: {
    ...mapState({
      project: (state) => state.project.project,
      scorecard: (state) => state.scorecard.scorecard,
      project_number: (state) => state.project.project.project_number,
      features: (state) => state.features.features,
      legalTypes: (state) => state.shared.legalTypes,
      generalTypes: (state) => state.shared.generalTypes,
    }),
    showPeriod() {
      if (this.verifMethod) {
        if (this.project.type === 'v2') {
          if ([16, 17, 18, 22].includes(parseInt(this.verifMethod.value))) {
            return true
          }
        } else if (this.project.type === 'v2-pilot') {
          if (
            [18, 23].includes(parseInt(this.verifMethod.value)) &&
            this.verifMethod.type === 'annotated_documents'
          ) {
            return true
          }
        }
      }
      return false
    },
    verificationOptions() {
      if (!this.verifications) {
        return []
      }
      if (this.project.type === 'v2') {
        return this.verifications.Verification.map((el) => {
          return {
            ...el,
            label: el.name,
            value: el.id,
          }
        })
      } else {
        const options = []
        Object.keys(this.verifications).forEach((el) => {
          this.verifications[el].forEach((verif) => {
            options.push({
              ...verif,
              type:
                el === 'AnnotatedDocument'
                  ? 'annotated_documents'
                  : el === 'LetterofAssurance'
                  ? 'letter_of_assurances'
                  : 'on_sites',
              label: verif.name,
              value: verif.id,
            })
          })
        })
        return options
      }
    },
    validationStatus() {
      const options = this.formData.feature_parts.length
      const file = this.formData.file
      const locations = this.formData.project_ids.length
      if (options && file && locations) {
        return true
      } else {
        return false
      }
    },
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
      return null
    },

    typeOptions() {
      const options = [
        { label: 'Upload General', value: 'general' },
        { label: 'Upload Legal', value: 'legal' },
        { label: 'Feature', value: 'feature' },
        { label: 'Audit', value: 'audit' },
      ]

      if (this.project.hsr_opt)
        options.push(
          {
            label: 'WELL Health-Safety - Ongoing maintenance report',
            value: 'hsr-maintenance-report',
          },
          {
            label: 'WELL Health-Safety - Ongoing data report',
            value: 'hsr-data-report',
          }
        )

      return options
    },
  },
  watch: {
    modeName() {
      this.mode = this.modeName
    },
    docType() {
      this.verifMethod = null
      this.formData = {
        document: [],
        project_ids: [],
        feature_parts: [],
        verifiable_id: null,
        verifiable_type: null,
        file: null,
        note: '',
      }
      this.errorLocation = false
      if (this.docType === 'audit' || this.docType === 'feature') {
        this.getVerifications()
      }
    },
    verifMethod() {
      this.formData = {
        document: [],
        legalTypeSelected: '',
        generalTypeSelected: '',
        project_ids: [],
        feature_parts: [],
        verifiable_id: null,
        verifiable_type: null,
        file: null,
        note: '',
      }
      this.errorLocation = false
    },
  },
  mounted() {},
  methods: {
    async getVerifications() {
      this.loading = true
      const type = this.project.type
      const url = `/api/verifications/${type}?is_auditable=${
        this.docType === 'audit' ? 1 : 0
      }`
      await this.$axios.get(url).then((resp) => {
        this.verifications = resp.data
      })
      this.loading = false
    },
    handleFileChange(event) {
      const fileExtension = event.target.files[0].name.split('.').pop()
      if (fileExtension === 'exe') {
        alert('This file type is not allowed.')
      } else if (fileExtension === 'zip') {
        // fix this logic
        if (this.formData.type === 'performance') {
          this.newPartDocument = event.target.files[0]
        } else {
          alert('This file type is not allowed.')
        }
      } else {
        this.newPartDocument = event.target.files[0]
      }
    },

    partList(part) {
      this.part = part
    },
    selectOption(option) {
      this.option = option
      this.scorecard_part_id = option.sub_part_id
    },
    optionId(data) {
      this.optionData = data
    },
    getLocationList(list) {
      this.formData.project_ids = list
    },
    getOptionList(list) {
      this.formData.feature_parts.push({
        part_id: parseInt(list.part),
        sub_part_id: parseInt(list.space_type),
        option_id: parseInt(list.option),
        requirement_ids: [],
      })
    },
    removeFeature(index) {
      this.formData.feature_parts.splice(index, 1)
      if (!this.formData.feature_parts.length) {
        this.formData.project_ids = []
      }
      if (index === 0 && this.formData.feature_parts.length) {
        this.$refs.location.initalSetup()
      }
    },
    async uploadDocument() {
      const data = this.formatFormData()

      try {
        const res = await this.$axios.post(
          this.docType === 'legal' || this.docType === 'general'
            ? `api/project-document/${this.project.id}/`
            : `api/scorecard/${this.project.scorecard_id}/document-upload/new`,
          data
        )
        if (res.status === 200) {
          if (this.$route.query.tab === 'Documents') {
            this.$parent.$parent.getDocuments()
          }
          this.$store.dispatch('notifications/toastMessage', {
            message: 'Document added!',
          })
        }
      } catch (error) {}
      this.$parent.$parent.getDocuments()
      this.$parent.isHidden = true
      this.uploading = false
    },

    formatFormData() {
      let data = null
      if (this.docType === 'legal' || this.docType === 'general') {
        data = {
          link_s3: this.formData.document[0].url,
          documentable_sub_type: this.docType,
          type: this.docType,
          stage: this.formData.stage ? 'Intent' : 'Implementation',
        }
      } else {
        data = new FormData()
        data.append('file', this.newPartDocument)

        data.append('project_ids[]', this.project.id)

        if (this.docType === 'audit') {
          data.append(
            'type',
            this.docType === 'audit' ? 'Audit-Document' : 'Portfolio-Scale'
          )
        }

        this.formData.feature_parts.forEach((el) => {
          data.append('feature_parts[]', JSON.stringify(el))
        })

        data.append('stage', this.formData.stage ? 'Intent' : 'Implementation')
        data.append('period', this.formData.period)

        if (this.docType === 'audit' || this.docType === 'feature') {
          data.append(
            'verifiable_type',
            this.project.type === 'v2'
              ? 'Verification'
              : this.verifMethod.type === 'letter_of_assurances'
              ? 'LetterofAssurance'
              : this.verifMethod.type
                  .toLowerCase()
                  .split('_')
                  .map(
                    (word) => word.charAt(0).toUpperCase() + word.substring(1)
                  )
                  .join('')
                  .slice(0, -1)
          )
          data.append('verifiable_id', this.verifMethod.value)
        }
        data.append('note', this.formData.note)
      }
      return data
    },
  },
}
</script>
