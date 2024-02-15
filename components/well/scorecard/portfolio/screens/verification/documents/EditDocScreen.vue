<template>
  <div>
    <div>
      <PortfolioScorecardEditLocationsScreen
        :key="selectedDoc.id"
        :class="mode !== 'locations' && 'hidden'"
        :edit-mode="true"
        :prefilled-locations="formData.project_ids"
        :option="selectedDoc"
        :part="part"
        :scorecard-part-id="selectedDoc.scorecard_parts[0].id"
        @getLocationList="getLocationList"
      />
    </div>
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

        <div class="flex mt-4">
          <span class="text-primary-800 text-base font-semibold"
            >Document type:
            <span class="text-primary-800 text-base font-normal">{{
              verification && !verification.is_auditable
                ? 'Feature verification'
                : 'Audit verification'
            }}</span></span
          >
        </div>

        <div v-if="verificationName" class="flex mt-2">
          <span class="text-primary-800 text-base font-semibold"
            >Verification method:
            <span class="text-primary-800 text-base font-normal">{{
              verificationName.name
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
        <div class="text-gray-600 flex flex-col">
          <span class="text-lg font-semibold">Selected feature part(s)</span>
          <span v-if="!verification.is_auditable" class="pt-1"
            >Add a feature part that is represented in your document. You may
            add as many feature parts as needed.</span
          >
          <span v-else class="pt-1"
            >Add a feature part that is represented in your document.</span
          >
        </div>

        <div
          v-for="(el, i) in selectedOptions"
          :key="i"
          class="py-4 px-6 border rounded-md border-gray-400"
        >
          <div class="flex items-center justify-between">
            <div
              :class="[
                'flex items-center',
                scorecard && scorecard.type !== 'wpr'
                  ? 'space-x-4'
                  : 'space-x-2',
              ]"
            >
              <div class="flex space-x-2 items-center">
                <img
                  v-if="scorecard && scorecard.type !== 'wpr'"
                  class="rounded-full w-6 mx-auto"
                  :src="`/scorecard/icons/${el.part.concept_name
                    .replace(/\s+/g, '-')
                    .toLowerCase()}.png`"
                />
                <span class="text-primary-900 font-semibold">{{
                  el.part.part_prefix
                }}</span>
              </div>
              <span
                v-if="scorecard && scorecard.type !== 'wpr'"
                class="text-primary-900 font-medium"
                >{{ el.part.name }}</span
              >
              <span v-else class="text-primary-900 font-semibold -ml-2">{{
                el.part.feature_name
              }}</span>
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
              <span class="font-normal"
                >{{ el.sub_part.space_types_included | getSubPartTitle
                }}<span v-if="el.sub_part.space_types_excluded.length">
                  except
                  {{ el.sub_part.space_types_excluded | getSubPartTitle }}</span
                ></span
              ></span
            >
            <span class="font-semibold text-sm text-primary-800"
              >Option{{ ' ' + el.option.option_order }}
              <span class="font-normal">
                {{ el.option.name ? ': ' + el.option.name : '' }}</span
              ></span
            >
            <span
              v-if="el.requirement"
              class="font-semibold text-sm text-primary-800"
              >Requirement(s) Type:
              <span
                v-for="(req, index) in el.requirement"
                :key="index"
                class="font-normal"
                v-html="req.label"
              ></span>
            </span>
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

        <div v-if="showPart">
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
            <div class="flex">
              <FormulateInput type="submit" label="Add Part" />
            </div>
          </FormulateForm>
        </div>
      </div>

      <div class="py-6 space-y-4 border-b-2 border-gray-300">
        <div class="text-gray-600 flex flex-col">
          <span class="text-lg font-semibold">Edit locations</span>
          <span class="pt-1"
            >Choose the locations that are represented in your document</span
          >
        </div>

        <div class="flex">
          <WButtonsBase
            type="primaryInverted"
            icon="pencil"
            class="shadow-none font-semibold w-44 rounded-sm"
            @click.native="
              ;(mode = 'locations'), ($parent.$parent.mode = 'locations')
            "
            >{{ `Edit locations` }}</WButtonsBase
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
          <WButtonsBase @click.native="updateDocument">Update</WButtonsBase>
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
      showPart: false,
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
        scorecard_part_id: null,
      },
      listData: [],
    }
  },
  computed: {
    ...mapState({
      verificationList: (state) => state.scorecard.activeVerificationsList,
      portfolio: (state) => state.portfolio.portfolio,
      scorecard: (state) => state.scorecard.scorecard,
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
    await this.$store.dispatch('scorecard/getPartVerifications', {
      part_id: this.part.id,
    })
    this.parseIncomingData()
    if (this.verification && this.verification.is_auditable) {
      await this.getAuditList()
    } else {
      this.getNonAuditList()
    }
  },
  methods: {
    parseIncomingData() {
      this.docType = this.selectedDoc.type
      this.verifMethod = this.selectedDoc.verifiable_id
      this.formData.project_ids = this.selectedDoc.project_ids.map((a) => a.id)
      this.formData.stage =
        this.selectedDoc.stage === 'Intent'
          ? (this.formData.stage = true)
          : (this.formData.stage = false)
      this.formData.note = this.selectedDoc.note

      this.selectedOptions = JSON.parse(
        JSON.stringify(this.selectedDoc.scorecard_parts)
      )
      this.note = this.selectedDoc.note
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
        scorecard_part_id: this.selectedDoc.scorecard_parts[0].id,
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
          `api/scorecard/${this.scorecard.id}/document/${this.selectedDoc.id}/new`,
          payload
        )
      } catch (error) {
        // console.log(error)
      }
      this.$parent.$parent.getDocuments()
      this.$parent.isHidden = true
      this.$parent.$parent.getVerificationList()
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

      this.newOption.scorecard_part_id = ''

      this.selectedOptions.push(temp)
      this.newOption = {
        part: null,
        space_type: null,
        option: null,
        requirement: null,
        scorecard_part_id: null,
      }
      this.resetVerifs = !this.resetVerifs
    },
    async getAuditList() {
      try {
        const { data } = await this.$axios.get(
          `api/scorecard/${this.scorecard.id}/${this.verification.type}/${this.verification.id}/auditList`
        )
        this.listData = data
      } catch (error) {}
    },
    async getNonAuditList() {
      let verification = {}
      if (this.portfolio.type === 'v2') {
        verification = {
          verifications: [this.verification.id],
        }
      } else {
        const type =
          this.verification.type === 'AnnotatedDocument'
            ? 'annotated_documents'
            : this.verification.type === 'LetterofAssurance'
            ? 'letter_of_assurances'
            : 'on_sites'
        verification[type] = [this.verification.id]
      }

      const { data } = await this.$axios.post(
        `api/version/${this.scorecard.version_id}?parts_list=only`,
        verification
      )
      this.listData = data
    },
  },
}
</script>
