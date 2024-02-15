<template>
  <div class="lg:max-h-96 lg:h-[600px] overflow-x-auto overflow-y-auto pr-2">
    <div :class="mode === 'locations' && 'hidden'" class="mr-5">
      <div>
        <div class="text-gray-600 flex flex-col">
          <span class="text-lg font-semibold">Document information</span>
        </div>
        <div v-if="verificationListOption.length > 1" class="mt-4">
          <span class="text-gray-600 font-semibold"
            >Select verification method</span
          >
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
            :options="verificationListOption"
          />
        </div>
        <div
          v-if="verificationListOption && verificationListOption.length === 1"
          class="flex mt-2"
        >
          <span class="text-primary-800 text-base font-semibold"
            >Verification method:
            <span
              v-if="verificationListOption"
              class="text-primary-800 text-base font-normal"
              >{{ verificationListOption[0].label }}</span
            >
          </span>
        </div>

        <div
          v-if="verificationListOption.length > 1"
          class="flex flex-col mt-4"
        >
          <span class="text-gray-600 font-semibold">Select document type</span>
          <FormulateInput
            v-model="docType"
            disabled
            :options="[
              {
                label: 'Upload audit document',
                value: 'audit',
              },
              {
                label: 'Upload feature verification',
                value: 'feature',
              },
            ]"
            type="select"
          />
        </div>
        <div
          v-if="verificationListOption && verificationListOption.length === 1"
          class="flex mt-2"
        >
          <span class="text-primary-800 text-base font-semibold"
            >Document type:
            <span
              v-if="verificationListOption"
              class="text-primary-800 text-base font-normal"
              >{{
                verificationListOption[0].is_auditable ? 'Audit' : 'Feature'
              }}</span
            >
          </span>
        </div>
      </div>
      <div>
        <div
          v-if="verifMethod"
          class="py-6 space-y-4 border-b-2 border-t-2 border-gray-200"
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

        <div class="py-6 space-y-4">
          <div class="text-gray-600 flex flex-col">
            <span class="text-lg font-semibold">File upload</span>
          </div>
          <div
            v-if="!newDocument"
            class="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"
          >
            <div>
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

        <div class="py-6 space-y-4">
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
        <FormulateInput
          v-model="formData.stage"
          label="This is an intent stage document"
          type="checkbox"
        />
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
    partId: {
      type: Number,
      required: true,
    },
    part: {
      type: Object,
      required: true,
    },
    modeName: {
      type: String,
      required: false,
      default: '',
    },
    module: {
      type: Object,
      required: false,
      default: () => {},
    },
    moduleType: {
      type: String,
      required: false,
      default: '',
    },
  },
  data() {
    return {
      uploading: false,
      verifications: null,
      // part: null,
      option: null,
      docType: 'feture',
      verifMethod: null,
      verificationListOption: [],
      formData: {
        document: [],
        project_ids: [],
        feature_parts: [],
        verifiable_id: null,
        verifiable_type: null,
        file: null,
        note: '',
      },
      scorecard_part_id: null,
      mode: '',
      stage: false,
      loading: false,
      isLocation: false,
      errorLocation: false,
      newDocument: null,
    }
  },

  computed: {
    ...mapState({
      project: (state) => state.project.project,
      scorecard: (state) => state.scorecard.scorecard,
    }),
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
            is_auditable: el.is_auditable,
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
                  ? 'letter_of_assurance'
                  : 'on_sites',
              label: verif.name,
              value: verif.id,
            })
          })
        })
        return options
      }
    },
  },

  watch: {
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
      if (this.verifMethod) {
        this.verifMethod.is_auditable
          ? (this.docType = 'audit')
          : (this.docType = 'feature')
      }
      this.errorLocation = false
    },
  },
  mounted() {
    if (this.module.type === 'v2-pilot') {
      const loa = this.part.letter_of_assurances.map((e) => {
        return {
          ...e,
          name: 'Letter of Assurance - ' + e.name,
          type: 'letter_of_assurances',
        }
      })
      const onSite = this.part.on_sites.map((e) => {
        return { ...e, type: 'on_sites' }
      })
      const annotatedDocuments = this.part.annotated_documents.map((e) => {
        return { ...e, type: 'annotated_documents' }
      })
      const verficiations = [...loa, ...onSite, ...annotatedDocuments]

      verficiations.forEach((verification) => {
        if (
          this.verificationListOption.filter((a) => a.value === verification.id)
            .length === 0
        ) {
          this.verificationListOption.push({
            label: verification.name,
            value: verification.id,
            type: verification.type,
            is_auditable: verification.is_auditable,
          })
        }
      })
    } else {
      this.part.subParts.forEach((subpart) => {
        subpart.options.forEach((option) => {
          option.verifications.forEach((verification) => {
            if (
              this.verificationListOption.filter(
                (a) => a.value === verification.id
              ).length === 0
            ) {
              this.verificationListOption.push({
                label: verification.name,
                value: verification.id,
                type: 'Verification',
                is_auditable: verification.is_auditable,
              })
            }
          })
        })
      })
    }
    if (this.verificationListOption.length === 1) {
      this.verifMethod = this.verificationListOption[0]
    }
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

    selectOption(option) {
      this.option = option
      this.scorecard_part_id = option.sub_part_id
    },
    getOptionList(list) {
      this.formData.scorecard_part_id = list.scorecard_part_id
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

      await this.$axios.post(
        `api/scorecard/${this.scorecard.id}/document-upload/new`,
        data
      )

      await this.$store
        .dispatch('scorecard/getProjectPartDocs', this.partId)
        .then((res) => {
          this.$parent.documents = res
          this.$store.dispatch('notifications/toastMessage', {
            message: 'Document added!',
          })
        })

      this.$parent.isHidden = true
      this.$parent.$parent.getDocuments()
      this.uploading = false
    },

    formatFormData() {
      const data = new FormData()
      const partIds = []
      partIds.push(this.partId)
      data.append(
        'type',
        this.docType === 'audit' ? 'Audit-Document' : 'Portfolio-Scale'
      )
      this.formData.feature_parts.forEach((el) => {
        data.append('feature_parts[]', JSON.stringify(el))
      })
      if (this.docType === 'audit' || this.docType === 'feature') {
        data.append(
          'verifiable_type',
          this.project.type === 'v2'
            ? 'Verification'
            : this.verifMethod.type
                .toLowerCase()
                .split('_')
                .map((word) => word.charAt(0).toUpperCase() + word.substring(1))
                .join('')
                .slice(0, -1)
        )
        data.append('verifiable_id', this.verifMethod.value)
      }
      data.append('note', this.formData.note)

      data.append('file', this.newDocument)
      data.append('part_doc_type', this.verifMethod.label)

      if (this.stage) data.append('stage', 'Intent')
      else data.append('stage', 'Implementation')
      data.append('phase', 'Register')
      data.append('type', '')
      data.append('project_ids[]', this.project.id)

      return data
    },
  },
}
</script>
