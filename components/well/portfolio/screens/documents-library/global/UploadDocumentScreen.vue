<template>
  <div class="lg:max-h-96 lg:h-[600px] overflow-x-auto overflow-y-auto pr-2">
    <div>
      <PortfolioLocationsScreen
        v-if="
          formData.feature_parts.length &&
          (docType === 'feature' ||
            (docType === 'audit' && formData.scorecard_part_id))
        "
        ref="location"
        :class="mode !== 'locations' && 'hidden'"
        :part="
          formData.feature_parts.length ? { id: formData.feature_parts[0] } : {}
        "
        :verification="
          verifMethod
            ? portfolio.type === 'v2'
              ? verificationOptions.find(
                  (a) => parseInt(a.id) === parseInt(verifMethod)
                )
              : verificationOptions.find(
                  (a) =>
                    a.type === verifMethod.type &&
                    parseInt(a.value) === parseInt(verifMethod.value)
                )
            : {}
        "
        :scorecard-part-id="formData.scorecard_part_id"
        :prefilled-locations="formData.project_ids"
        @getLocationList="getLocationList"
      />
    </div>
    <div :class="mode === 'locations' && 'hidden'" class="mr-5">
      <div>
        <div class="text-gray-600 flex flex-col">
          <span class="text-lg font-semibold">Document information</span>
        </div>

        <div class="flex flex-col mt-4">
          <span class="text-gray-600 font-semibold">Select document type</span>
          <FormulateInput
            v-model="docType"
            :options="[
              {
                label: 'Upload the requested general information items',
                value: 'general',
              },
              { label: 'Upload a legal document', value: 'legal' },

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
      </div>
      <div v-if="docType === 'legal' || docType === 'general'">
        <div v-if="docType === 'legal'" class="flex flex-col">
          <span class="text-gray-600 font-semibold">Type *</span>
          <FormulateInput
            v-model="formData.legalTypeSelected"
            type="select"
            placeholder="Select option"
            :options="legalTypes"
            validation="required"
          />
        </div>
        <div v-if="docType === 'general'" class="flex flex-col">
          <span class="text-gray-600 font-semibold">Type *</span>
          <FormulateInput
            v-model="formData.generalTypeSelected"
            type="select"
            placeholder="Select option"
            :options="generalTypes"
            validation="required"
          />
        </div>
        <span class="text-gray-600 font-semibold">File upload:</span>
        <FormulateInput
          v-model="formData.document"
          :value="formData.document"
          type="fileupload"
          :upload-path="`portfolio/${portfolio.portfolio_number}/documents/`"
          mime-types=""
          validation="required"
        />

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
      <div v-else>
        <div class="flex flex-col mt-5">
          <span class="text-gray-600 font-semibold"
            >Select verification method</span
          >
          <div v-if="!loading">
            <FormulateInput
              v-if="portfolio.type === 'v2'"
              v-model="verifMethod"
              type="select"
              placeholder="Select verification"
              :options="verificationOptions"
            />
            <multiselect
              v-else
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
          <PortfolioFeatureSelectScreen
            ref="featureSelect"
            :is-audit="docType === 'audit'"
            :verification="verifMethod"
            @getOptionList="getOptionList"
            @removeFeature="removeFeature"
          />
        </div>

        <div class="py-6 space-y-4 border-b-2 border-gray-200">
          <div class="text-gray-600 flex flex-col">
            <span class="text-lg font-semibold">Confirm locations</span>
            <span class="pt-1"
              >Choose the locations that are represented in your document</span
            >
          </div>

          <div class="w-full">
            <div v-if="!isLocation" class="flex">
              <WButtonsBase
                :disabled="!formData.feature_parts.length"
                :type="
                  formData.project_ids.length ? 'primaryInverted' : 'primary'
                "
                icon="pencil"
                class="shadow-none font-semibold w-44 rounded-sm"
                @click.native="
                  ;(mode = 'locations'), ($parent.$parent.mode = 'locations')
                "
                >{{
                  formData.project_ids.length
                    ? `Edit locations`
                    : 'Confirm locations'
                }}</WButtonsBase
              >
              <div
                v-if="formData.project_ids.length"
                class="flex items-center space-x-2 text-primary-600 ml-8"
              >
                <WIconsBase icon="office-building" />
                <span>
                  {{ formData.project_ids.length }} Locations assigned to this
                  document
                </span>
              </div>
            </div>
            <div v-else>
              <div class="mx-auto text-center">
                <WLoadingSpinner class="mx-auto" />
              </div>
            </div>
            <div
              v-if="errorLocation"
              class="bg-red-100 border border-danger-500 mt-5 p-5 rounded text-danger-600 text-sm"
            >
              No Audits are pending for the selected Option
            </div>
          </div>
        </div>

        <div class="py-6 space-y-4">
          <div class="text-gray-600 flex flex-col">
            <span class="text-lg font-semibold">File upload</span>
          </div>
          <FileUploader v-model="formData.file" />
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
    modeName: {
      type: String,
      required: false,
      default: '',
    },
  },
  data() {
    return {
      uploading: false,
      verifications: null,
      part: null,
      option: null,
      docType: 'general',
      verifMethod: null,
      formData: {
        document: [],
        legalTypeSelected: '',
        generalTypeSelected: '',
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
    }
  },

  computed: {
    ...mapState({
      portfolio: (state) => state.portfolio.portfolio,
      scorecard: (state) => state.scorecard.scorecard,
      legalTypes: (state) => state.shared.legalTypes,
      generalTypes: (state) => state.shared.generalTypes,
    }),
    scorecardPartId() {
      if (this.part && this.option) {
        return this.part.scorecard_part.find(
          (el) => el.option_id === this.option.id
        )?.id
      } else {
        return ''
      }
    },
    verificationOptions() {
      if (!this.verifications) {
        return []
      }
      if (this.portfolio.type === 'v2') {
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
  },

  watch: {
    modeName() {
      this.mode = this.modeName
    },
    docType() {
      this.verifMethod = null
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
  methods: {
    async getVerifications() {
      this.loading = true
      const type = this.portfolio.type
      const url = `/api/verifications/${type}?is_auditable=${
        this.docType === 'audit' ? 1 : 0
      }`
      await this.$axios.get(url).then((resp) => {
        this.verifications = resp.data
      })
      this.loading = false
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
      try {
        const res = await this.$axios.post(
          this.docType === 'legal' || this.docType === 'general'
            ? `api/portfolio/${this.portfolio.id}/document`
            : `api/scorecard/${this.scorecard.id}/document-upload/new`,
          data
        )
        if (res.status === 200) {
          if (this.$route.query.tab === 'Documents') {
            this.$parent.$parent.$refs.fileScreen.getDocuments()
          }
          this.$store.dispatch('notifications/toastMessage', {
            message: 'Document added!',
          })
        }
      } catch (error) {}
      this.$parent.isHidden = true
      this.uploading = false
    },

    formatFormData() {
      const data = new FormData()
      if (this.docType === 'audit' || this.docType === 'feature') {
        data.append('file', this.formData.file)
      }
      if (this.docType === 'legal' || this.docType === 'general') {
        data.append('link_s3', this.formData.document[0].url)
        data.append('documentable_sub_type', this.docType)
      }
      this.formData.project_ids.forEach((id) => {
        data.append('project_ids[]', id)
      })
      if (this.docType === 'audit') {
        data.append('scorecard_part_id', this.formData.scorecard_part_id)
      } else if (this.docType === 'legal') {
        data.append('type', this.formData.legalTypeSelected)
      } else if (this.docType === 'general') {
        data.append('type', this.formData.generalTypeSelected)
      } else {
        data.append(
          'type',
          this.docType === 'audit' ? 'Audit-Document' : 'Portfolio-Scale'
        )
      }
      if (this.docType === 'feature') {
        this.formData.feature_parts.forEach((el) => {
          data.append('feature_parts[]', JSON.stringify(el))
        })
      }
      if (this.stage) data.append('stage', 'Intent')
      else data.append('stage', 'Implementation')
      if (this.docType === 'audit' || this.docType === 'feature') {
        data.append(
          'verifiable_type',
          this.portfolio.type === 'v2'
            ? 'Verification'
            : this.verifMethod.type === 'letter_of_assurances'
            ? 'LetterofAssurance'
            : this.verifMethod.type
                .toLowerCase()
                .split('_')
                .map((word) => word.charAt(0).toUpperCase() + word.substring(1))
                .join('')
                .slice(0, -1)
        )
        data.append(
          'verifiable_id',
          this.portfolio.type === 'v2'
            ? this.verifMethod
            : this.verifMethod.value
        )
      }
      data.append('note', this.formData.note)
      return data
    },
  },
}
</script>
