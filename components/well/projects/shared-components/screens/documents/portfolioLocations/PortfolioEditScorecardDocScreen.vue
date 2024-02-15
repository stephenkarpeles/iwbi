<template>
  <div>
    <div
      :class="[
        mode === 'locations' && 'hidden',
        'lg:max-h-96 lg:h-[600px] mb-8',
      ]"
    >
      <div class="pb-6 border-b-2 border-gray-300">
        <div class="text-primary-800 flex flex-col">
          <span class="text-xl font-bold">Document information</span>
        </div>
        <div v-if="selectedDoc" class="flex mt-2">
          <span class="text-primary-800 text-base font-semibold"
            >Verification method:
            <span class="text-primary-800 text-base font-normal">{{
              selectedDoc.verifiable.name
            }}</span></span
          >
        </div>

        <div class="flex mt-4">
          <span class="text-primary-800 text-base font-semibold"
            >Document type:
            <span class="text-primary-800 text-base font-normal">{{
              !selectedDoc.verifiable.is_auditable ? 'Feature' : 'Audit'
            }}</span></span
          >
        </div>

        <div v-if="selectedDoc" class="flex justify-between mt-2">
          <WLinksBase
            icon="paper-clip"
            :link="selectedDoc.link_s3_private"
            target="_blank"
          >
            {{ selectedDoc.name }}
          </WLinksBase>
          <div class="text-gray-400 text-sm leading-5">
            Uploaded at
            {{ $dayjs(selectedDoc.created_at).format('MM/DD/YYYY') }}
          </div>
        </div>
      </div>

      <div class="py-6 space-y-4 border-b-2 border-gray-300">
        <div class="text-primary-800 flex flex-col">
          <span class="text-lg font-semibold">Selected feature part(s)</span>
          <div v-if="verification">
            <span v-if="!verification.is_auditable" class="pt-1"
              >Add a feature part that is represented in your document. You may
              add as many feature parts as needed.</span
            >
            <span v-else class="pt-1"
              >Add a feature part that is represented in your document.</span
            >
          </div>
        </div>
        <div v-if="listData.length" class="space-y-4">
          <div
            v-for="(el, i) in selectedOptions"
            :key="i"
            class="py-4 px-6 border rounded-md border-gray-400"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <div class="flex space-x-2 items-center">
                  <img
                    class="rounded-full w-6 mx-auto"
                    :src="`/scorecard/icons/Air.png`"
                  />
                  <span class="text-primary-800 text-lg">{{
                    el.part.part_prefix
                  }}</span>
                </div>
                <span class="text-primary-800 text-lg">{{ el.part.name }}</span>
              </div>
              <button
                v-if="!el.pivot.status"
                class="text-danger-600 font-semibold"
                @click="removeOption(i)"
              >
                Remove
              </button>
              <span v-else class="text-gray-400 font-semiBold text-base">{{
                el.pivot.status
              }}</span>
            </div>
            <div class="flex flex-col space-y-2 mt-2">
              <span class="font-semibold text-sm text-primary-800"
                >Space Type:

                <span class="font-normal">{{
                  el.sub_part.space_types_included | getSubPartTitle
                }}</span></span
              >
            </div>

            <div class="flex flex-col space-y-2 mt-2">
              <span class="font-semibold text-sm text-primary-800"
                >Option{{ ' ' + el.option.option_order }}
                <span class="font-normal">
                  {{ el.option.name ? ': ' + el.option.name : '' }}</span
                ></span
              >
            </div>
          </div>
          <div
            v-if="verification && !verification.is_auditable"
            class="-ml-1.5"
            @click="showPart = !showPart"
          >
            <div class="text-primary-800 flex mt-4 cursor-pointer">
              <WIconsBase v-if="showPart" icon="chevron-down" />
              <WIconsBase v-else icon="chevron-right" /><span
                class="text-base font-bold"
                >Add feature part(s)</span
              >
            </div>
          </div>
          <div v-if="verification && !verification.is_auditable && showPart">
            <FormulateForm
              :key="resetVerifs"
              class="py-4 px-6 border rounded-md border-gray-400"
              @submit="addNewOption()"
            >
              <FormulateInput
                v-model="newOption.part"
                validation="required"
                name="Part"
                :options="parts"
                type="select"
                placeholder="Select Feature Part"
              />
              <FormulateInput
                v-model="newOption.space_type"
                validation="required"
                name="Space type"
                type="select"
                :options="spaceTypes"
                placeholder="Select Space Type"
                :disabled="!newOption.part"
              />
              <FormulateInput
                v-model="newOption.option"
                validation="required"
                type="select"
                name="Option"
                :options="options"
                :disabled="!newOption.space_type"
                placeholder="Select Option"
              />
              <span
                v-if="duplicateFound"
                class="text-sm text-red-500 mb-3 inline-block"
                >This part already has been added and cannot be added
                again.</span
              >
              <span
                v-if="duplicateFound"
                class="text-sm text-red-500 mb-3 inline-block"
                >This part already has been added and cannot be added
                again.</span
              >
              <div class="flex">
                <FormulateInput
                  :disabled="duplicateFound"
                  type="submit"
                  label="Add Part"
                />
              </div>
            </FormulateForm>
          </div>
        </div>
        <div v-else class="mx-auto mt-5 text-center">
          <WLoadingSpinner class="mx-auto" />
          <div class="mt-3 text-primary-600">Please Wait...</div>
        </div>
      </div>

      <div class="py-6 space-y-4 border-b-2 border-gray-300">
        <div class="text-gray-600 flex flex-col">
          <span class="text-lg font-semibold">Edit note</span>
          <span class="text-sm pt-2 font-normal"
            >Add additional notes or context to this document that you'd like to
            share with your review team.</span
          >
        </div>
        <FormulateInput v-model="formData.note" type="textarea" />
      </div>

      <div
        class="flex items-center justify-between sticky bottom-0 bg-white border-t border-gray-200 py-2"
      >
        <FormulateInput
          v-model="formData.stage"
          label="This is an intent stage document"
          type="checkbox"
        />
        <div>
          <WButtonsBase @click.native="updateDocument(), (uploading = true)">
            <WLoadingSpinner v-if="uploading" type="button" class="mx-auto" />
            <span v-else>Update</span></WButtonsBase
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
    selectedDoc: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      formData: {
        project_ids: [],
        stage: false,
        note: '',
      },
      uploading: false,
      showPart: true,
      mode: '',
      docType: null,
      verifMethod: null,
      validationStatus: false,
      selectedOptions: [],
      resetVerifs: false,
      newOption: {
        part: null,
        space_type: null,
        option: null,
        requirement: null,
      },
      listData: [],
    }
  },
  computed: {
    ...mapState({
      verificationList: (state) => state.scorecard.activeVerificationsList,
      project: (state) => state.project.project,
    }),

    verificationOptions() {
      return this.verificationList.map((el) => {
        return {
          ...el,
          label: el.name,
          value: el.id,
        }
      })
    },
    verification() {
      return this.verificationOptions.find(
        (el) => el.id === this.selectedDoc.verifiable_id
      )
    },
    verificationName() {
      return this.verificationOptions.find((el) => el.id === this.verifMethod)
    },
    parts() {
      return this.listData.map((el) => {
        return {
          ...el,
          label: el.part_prefix,
          value: el.id,
        }
      })
    },
    duplicateFound() {
      // 1. Parts dropdown selection is found in selectedOptions (looking for duplicates to Added Parts)
      const removePartsArr = this.selectedOptions.map((el) => el?.part?.id)
      const duplicatePart = removePartsArr.includes(
        parseInt(this.newOption.part)
      )
      // 2. Spacetypes dropdown selection is found in selectedOptions (looking for duplicates to Added Parts)
      const removeSpacetypesArr = this.selectedOptions.map(
        (el) => el?.space_type?.id
      )
      const duplicateSpacetype = removeSpacetypesArr.includes(
        parseInt(this.newOption.space_type)
      )

      // 3. Options dropdown selection is found in selectedOptions (looking for duplicates to Added Parts)
      const removeOptionsArr = this.selectedOptions.map((el) => el?.option?.id)
      const duplicateOption = removeOptionsArr.includes(
        parseInt(this.newOption.option)
      )

      // Duplicate Found, Prevent Adding
      if (duplicatePart && duplicateSpacetype && duplicateOption) {
        return true
      } else {
        return false
      }
    },
    spaceTypes() {
      if (this.listData.length && this.newOption.part) {
        return this.listData
          .find((el) => el.id === parseInt(this.newOption.part))
          ?.sub_parts.map((el) => {
            return {
              ...el,
              label: this.$options.filters.getSubPartTitle(
                el.space_types_included
              ),
              value: el.id,
            }
          })
      } else {
        return []
      }
    },
    options() {
      if (this.newOption.space_type && this.spaceTypes) {
        return this.spaceTypes
          .find((el) => el.id === parseInt(this.newOption.space_type))
          ?.options.map((el) => {
            return {
              ...el,
              label: el.name
                ? 'Option ' + el.option_order + ' ' + el.name
                : 'Option ' + el.option_order,
              value: el.id,
            }
          })
      } else {
        return []
      }
    },
  },
  watch: {
    modeName() {
      this.mode = this.modeName
    },
  },
  async mounted() {
    console.log(this.selectedDoc.parts[0].id)
    await this.$store.dispatch('scorecard/getPartVerifications', {
      id: this.project.scorecard_id,
      part_id: this.selectedDoc.parts[0].id,
    })
    await this.getNonAuditList()
    this.parseIncomingData()
  },
  methods: {
    parseIncomingData() {
      this.docType = this.selectedDoc.type
      this.verifMethod = this.selectedDoc.verifiable_id
      this.newOption.part = this.selectedDoc.parts[0].id
      this.formData.project_ids = this.selectedDoc.project_ids.map((a) => a.id)
      this.formData.stage =
        this.selectedDoc.stage === 'Intent'
          ? (this.formData.stage = true)
          : (this.formData.stage = false)
      this.formData.note = this.selectedDoc.note

      this.selectedOptions = JSON.parse(
        JSON.stringify(this.selectedDoc.scorecard_parts)
      )
    },
    removeOption(index) {
      this.selectedOptions.splice(index, 1)
    },
    async updateDocument() {
      if (!this.selectedOptions.length) {
        this.$store.dispatch('notifications/toastMessage', {
          message: 'Please add atleast one feature part.',
        })
        this.$parent.isHidden = true
        return false
      }
      const payload = {
        project_ids: this.formData.project_ids,
        feature_parts: this.selectedOptions.map((el) => {
          return {
            part_id: parseInt(el.part.id),
            sub_part_id: parseInt(el.sub_part_id),
            option_id: parseInt(el.option.id),
            requirement_ids: [],
          }
        }),
        verifiable_type: this.verification.type,
        verifiable_id: this.verification.id,
        note: this.formData.note,
        stage: this.formData.stage ? 'Intent' : 'Implementation',
      }

      try {
        await this.$axios.put(
          `api/scorecard/${this.project.scorecard_id}/document/${this.selectedDoc.id}/new`,
          payload
        )
      } catch (error) {
        // console.log(error)
      }
      this.$parent.$parent.getDocuments()
      this.$parent.isHidden = true
      this.uploading = false
    },
    getLocationList(list) {
      this.formData.project_ids = list
    },
    addNewOption() {
      const part = this.listData.find(
        (el) => el.id === parseInt(this.newOption.part)
      )
      const temp = {
        part,
        option: this.options.find(
          (el) => el.id === parseInt(this.newOption.option)
        ),
        space_type: this.spaceTypes.find(
          (el) => el.id === parseInt(this.newOption.space_type)
        ),
        sub_part: this.spaceTypes.find(
          (el) => el.id === parseInt(this.newOption.space_type)
        ),
        sub_part_id: this.options.find(
          (el) => el.id === parseInt(this.newOption.option)
        ).sub_part_id,
        pivot: {
          status: '',
        },
      }

      this.selectedOptions.push(temp)
      this.newOption = {
        part: null,
        space_type: null,
        option: null,
        requirement: null,
      }
      this.resetVerifs = !this.resetVerifs
    },

    async getNonAuditList() {
      let verification = {}
      verification = {
        verifications: [this.selectedDoc.verifiable_id],
      }
      const { data } = await this.$axios.post(
        `api/version/${this.project.applicable_version_id}?parts_list=only`,
        verification
      )
      this.listData = data
    },
  },
}
</script>
