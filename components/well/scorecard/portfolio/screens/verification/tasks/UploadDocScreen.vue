<template>
  <div class="lg:max-h-96 lg:h-[600px]">
    <PortfolioScorecardLocationsScreen
      :class="mode !== 'locations' && 'hidden'"
      :option="option"
      :part="part"
      :scorecard-part-id="scorecardPartId"
      @getLocationList="getLocationList"
    />
    <div :class="mode === 'locations' && 'hidden'">
      <div class="pb-6 border-b-2 border-gray-300">
        <div class="text-primary-800 font-bold flex flex-col">
          <span class="text-xl font-bold">Document information</span>
        </div>
        <div class="flex mt-4">
          <span class="text-primary-800 text-base font-semibold"
            >Document type:
            <span
              v-if="verificationName"
              class="text-primary-800 text-base font-normal"
            >
              {{
                !verificationName.is_auditable
                  ? 'Feature verification'
                  : 'Audit verification'
              }}
            </span>
          </span>
        </div>

        <div v-if="verificationName" class="flex mt-2">
          <span class="text-primary-800 text-base font-semibold"
            >Verification method:
            <span class="text-primary-800 text-base font-normal">{{
              verificationName.name
            }}</span></span
          >
        </div>
      </div>

      <div class="py-6 space-y-4 border-b-2 border-gray-300">
        <div class="text-gray-600 flex flex-col">
          <span class="text-lg font-semibold">Selected feature part(s)</span>
          <div v-if="verificationName">
            <span v-if="!verificationName.is_auditable" class="pt-1"
              >Add a feature part that is represented in your document. You may
              add as many feature parts as needed.</span
            >
            <span v-else class="pt-1"
              >Add a feature part that is represented in your document.</span
            >
          </div>
        </div>
        <PortfolioScorecardFeatureSelectScreen
          v-if="verificationName"
          :part="part"
          :option="option"
          :verification="verificationName"
          @getOptionList="getOptionList"
          @removeFeature="removeFeature"
        />
      </div>

      <div class="py-6 space-y-4 border-b-2 border-gray-300">
        <div class="text-gray-600 flex flex-col">
          <span class="text-lg font-semibold">Confirm locations</span>
          <span class="pt-1"
            >Choose the locations that are represented in your document</span
          >
        </div>

        <div class="flex">
          <WButtonsBase
            :type="formData.project_ids.length ? 'primaryInverted' : 'primary'"
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
      </div>

      <div class="py-6 space-y-4 border-b-2 border-gray-300">
        <div class="text-gray-600 flex flex-col">
          <span class="text-lg font-semibold">File upload</span>
        </div>
        <FileUploader v-model="formData.file" />
      </div>

      <div class="py-6 space-y-4">
        <div class="text-gray-600 flex flex-col">
          <span class="text-lg font-semibold">Add a note</span>
          <span class="text-sm pt-2 font-normal"
            >Add additional notes or context to this document that you'd like to
            share with your review team.</span
          >
        </div>
        <FormulateInput v-model="formData.note" type="textarea" />
      </div>

      <div
        class="flex items-center justify-between sticky bottom-0 bg-white border-t border-gray-200 pt-2 shadow-2xl"
      >
        <FormulateInput
          v-model="stage"
          label="This is an intent stage document"
          type="checkbox"
        />
        <div>
          <WButtonsBase
            :disabled="!validationStatus"
            @click.native="uploadDocument(), (uploading = true)"
          >
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
    part: {
      type: Object,
      required: true,
    },
    modeName: {
      type: String,
      required: false,
      default: '',
    },
    option: {
      type: Object,
      required: true,
    },
    taskVerification: {
      type: Array,
      required: false,
      default: null,
    },
  },
  data() {
    return {
      docType: null,
      verifMethod: null,
      formData: {
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
      uploading: false,
    }
  },
  computed: {
    ...mapState({
      scorecard: (state) => state.scorecard.scorecard,
      verificationList: (state) => state.scorecard.activeVerificationsList,
    }),
    scorecardPartId() {
      return this.part.scorecard_part.find(
        (el) => el.option_id === this.option.id
      )?.id
    },
    verificationOptions() {
      if (this.taskVerification) {
        return this.taskVerification.map((el) => {
          return {
            ...el,
            label: el.name,
            value: el.id,
          }
        })
      } else {
        return this.verificationList.map((el) => {
          return {
            ...el,
            label: el.name,
            value: el.id,
          }
        })
      }
    },
    verificationName() {
      return this.verificationOptions.find((el) => el.id === this.verifMethod)
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
  },
  mounted() {
    this.parseIncomingData()
  },
  methods: {
    getLocationList(list) {
      this.formData.project_ids = list
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
    getOptionList(list) {
      this.scorecard_part_id = list.scorecard_part_id
      this.formData.feature_parts.push({
        part_id: parseInt(list.part),
        sub_part_id: parseInt(list.space_type),
        option_id: parseInt(list.option),
        requirement_ids: [],
      })
    },
    async uploadDocument() {
      const data = this.formatFormData()
      try {
        const res = await this.$axios.post(
          `api/scorecard/${this.scorecard.id}/document-upload/new`,
          data
        )
        if (res.status === 200) {
          await this.updatePartState()
          this.$parent.isHidden = true
          await this.$store.dispatch('notifications/toastMessage', {
            message: 'Document added!',
          })
          this.$parent.$parent.$parent.$parent.$refs.docHover.documentCount++
        }
      } catch (error) {
        // console.log(error)
      }
      this.uploading = false
    },

    formatFormData() {
      const data = new FormData()
      data.append('file', this.formData.file)
      this.formData.project_ids.forEach((id) => {
        data.append('project_ids[]', id)
      })
      if (this.docType === 'Audit-Document') {
        data.append('scorecard_part_id', this.scorecard_part_id)
      } else {
        this.formData.feature_parts.forEach((el) => {
          data.append('feature_parts[]', JSON.stringify(el))
        })
      }

      data.append('type', this.docType)

      if (this.stage) data.append('stage', 'Intent')
      else data.append('stage', 'Implementation')
      data.append('verifiable_type', this.option.verification.type)
      data.append('verifiable_id', this.option.verification.id)
      data.append('note', this.formData.note)
      return data
    },
    parseIncomingData() {
      this.docType = this.option.verification.is_auditable ? 'audit' : 'feature'
      if (this.docType === 'audit') {
        this.docType = 'Audit-Document'
      } else {
        this.docType = 'Portfolio-Scale'
      }
      this.verifMethod = this.option.verification.id
    },

    async updatePartState() {
      await this.$store.dispatch('scorecard/getPartVerifications', {
        part_id: this.part.id,
      })
      await this.$store.dispatch('scorecard/getPartDocs', {
        part_id: this.part.id,
        page: '1',
      })
    },
  },
}
</script>
