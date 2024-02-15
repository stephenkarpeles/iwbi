<template>
  <div v-if="!apiLoading">
    <div v-if="parts.length">
      <div v-if="selectedOptions.length" class="space-y-4">
        <div
          v-for="(el, i) in selectedOptions"
          :key="i"
          class="py-4 px-6 border rounded-md border-gray-200 shadow-inner"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="flex space-x-2 items-center">
                <img
                  class="rounded-full w-6 mx-auto"
                  :src="`/scorecard/icons/${el.part.concept_name
                    .replace(/\s+/g, '-')
                    .toLowerCase()}.png`"
                />
                <span class="text-primary-900 font-semibold">{{
                  el.part.part_prefix
                }}</span>
              </div>
              <span class="text-primary-900 font-medium">{{
                el.part.name
              }}</span>
            </div>
            <button
              class="text-red-700 hover:text-primary-600 font-medium text-sm"
              @click="removeOption(i)"
            >
              Remove
            </button>
          </div>
          <div class="flex flex-col space-y-2 mt-2">
            <span class="font-semibold text-sm text-primary-800"
              >Space Type:
              <span class="font-normal"
                >{{ el.space_type.space_types_included | getSubPartTitle
                }}<span v-if="el.space_type.space_types_excluded.length">
                  except
                  {{
                    el.space_type.space_types_excluded | getSubPartTitle
                  }}</span
                ></span
              ></span
            >
            <span class="font-semibold text-sm text-primary-800"
              >Option {{ el.option.option_order }}:
              <span class="font-normal">{{ el.option.name }}</span></span
            >
          </div>
        </div>
      </div>
      <div
        v-if="selectedOptions.length && !isAudit"
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

      <div v-if="!selectedOptions.length || showPart" :class="`mt-4 `">
        <FormulateForm
          :key="resetVerifs"
          class="py-4 px-6 border rounded-md border-gray-200 shadow-inner"
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
            >This part already has been added and cannot be added again.</span
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
    <div v-if="!listData.length">
      There are no tasks available for this verification.
    </div>
  </div>
  <div v-else class="mx-auto mt-5 text-center">
    <WLoadingSpinner class="mx-auto" />
    <div class="mt-3 text-primary-600">Please Wait...</div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    verification: {
      type: [Object, String],
      default: null,
    },
    isAudit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      selectedOptions: [],
      newOption: {
        part: null,
        space_type: null,
        option: null,
        scorecard_part_id: null,
      },
      listData: [],
      resetVerifs: false,
      showPart: false,
      apiLoading: false,
    }
  },
  computed: {
    ...mapState({
      project: (state) => state.project.project,
      features: (state) => state.scorecard.filteredFeatures,
      scorecard: (state) => state.scorecard.scorecard,
      partsItem: (state) => state.scorecard.filteredParts,
    }),
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
      if (this.newOption.part) {
        return this.parts
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
              label: el.name ? el.name : 'Option ' + el.option_order,
              value: el.id,
            }
          })
      } else {
        return []
      }
    },
  },
  watch: {
    verification() {
      this.selectedOptions = []
      this.getNonAuditList()
    },
  },
  async mounted() {
    await this.$store.dispatch(
      'scorecard/getScorecard',
      this.project.scorecard_id
    )

    await this.getNonAuditList()
  },
  methods: {
    addNewOption() {
      // aggregate objects
      const temp = {
        part: this.parts.find((el) => el.id === parseInt(this.newOption.part)),
        option: this.options.find(
          (el) => el.id === parseInt(this.newOption.option)
        ),
        space_type: this.spaceTypes.find(
          (el) => el.id === parseInt(this.newOption.space_type)
        ),
      }
      this.selectedOptions.push(temp)
      this.newOption.scorecard_part_id = temp.option.scorecard_part_id
      this.$emit('getOptionList', this.newOption)
      this.newOption = {
        part: null,
        space_type: null,
        option: null,

        scorecard_part_id: null,
      }
      this.resetVerifs = !this.resetVerifs
    },
    removeOption(index) {
      this.selectedOptions.splice(index, 1)
      this.$emit('removeFeature', index)
    },
    async getNonAuditList() {
      this.apiLoading = true
      this.listData = []
      let payload = {}
      if (this.project.type === 'v2') {
        payload = {
          verifications: this.verification ? [this.verification.value] : [],
        }
      } else {
        payload = {
          letter_of_assurances:
            this.verification.type === 'letter_of_assurances'
              ? [this.verification.value]
              : [],
          on_sites:
            this.verification.type === 'on_sites'
              ? [this.verification.value]
              : [],
          annotated_documents:
            this.verification.type === 'annotated_documents'
              ? [this.verification.value]
              : [],
        }
      }
      try {
        const { data } = await this.$axios.post(
          `api/version/${this.scorecard.version_id}?parts_list=only`,
          {
            ...payload,
          }
        )
        this.listData = JSON.parse(JSON.stringify(data))
      } catch (error) {}
      this.apiLoading = false
    },
  },
}
</script>
