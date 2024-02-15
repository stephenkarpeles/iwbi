<template>
  <div v-if="listData.length">
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
            <span class="text-primary-900 font-medium">{{ el.part.name }}</span>
          </div>
          <button
            v-if="el.part.id !== part.id"
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
                {{ el.space_type.space_types_excluded | getSubPartTitle }}</span
              ></span
            ></span
          >
          <div class="flex flex-col space-y-2 mt-2">
            <span class="font-semibold text-sm text-primary-800"
              >Option{{ ' ' + el.option.option_order }}
              <span class="font-normal">
                {{ el.option.name ? ': ' + el.option.name : '' }}</span
              ></span
            >
          </div>
        </div>
      </div>
    </div>
    <div v-if="!isAudit" class="-ml-1.5" @click="showPart = !showPart">
      <div class="text-primary-800 flex mt-4 cursor-pointer">
        <WIconsBase v-if="showPart" icon="chevron-down" />
        <WIconsBase v-else icon="chevron-right" /><span
          class="text-base font-bold"
          >Add feature part(s)</span
        >
      </div>
    </div>
    <div
      v-if="showPart"
      :class="`mt-4 ${isAudit && selectedOptions.length > 0 ? 'hidden' : ''}`"
    >
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
  <div v-else class="mx-auto mt-5 text-center">
    <WLoadingSpinner class="mx-auto" />
    <div class="mt-3 text-primary-600">Please Wait...</div>
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
    option: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      selectedOptions: [],
      newOption: {
        part: null,
        space_type: null,
        option: null,
        requirement: null,
        scorecard_part_id: null,
      },
      listData: [],
      resetVerifs: false,
      showPart: false,
    }
  },
  computed: {
    ...mapState({
      features: (state) => state.scorecard.filteredFeatures,
      portfolio: (state) => state.portfolio.portfolio,
      scorecard: (state) => state.scorecard.scorecard,
    }),
    isAudit() {
      return this.option.verification.is_auditable
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
  async mounted() {
    this.parseExistingOption()
    if (this.isAudit) {
      await this.getAuditList()
    } else {
      await this.getNonAuditList()
    }
  },
  methods: {
    addNewOption() {
      const temp = {
        part: this.parts.find((el) => el.id === parseInt(this.newOption.part)),
        option: this.options.find(
          (el) => el.id === parseInt(this.newOption.option)
        ),
        space_type: this.spaceTypes
          ? this.spaceTypes.find(
              (el) => el.id === parseInt(this.newOption.space_type)
            )
          : {},
      }
      this.selectedOptions.push(temp)
      this.newOption.scorecard_part_id = this.option.id
      this.$emit('getOptionList', this.newOption)
      this.newOption = {
        part: null,
        space_type: null,
        option: null,

        scorecard_part_id: null,
      }
      this.resetVerifs = !this.resetVerifs
    },
    parseExistingOption() {
      this.newOption.part = this.part.id
      this.newOption.space_type = this.option.subpart_id
      this.newOption.option = this.option.id
    },
    removeOption(index) {
      this.selectedOptions.splice(index, 1)
      this.$emit('removeFeature', index)
    },

    async getAuditList() {
      try {
        const { data } = await this.$axios.get(
          `api/scorecard/${this.scorecard.id}/${this.option.verification.type}/${this.option.verification.id}/auditList`
        )
        this.listData = data
      } catch (error) {}
      this.addNewOption()
    },

    async getNonAuditList() {
      let verification = {}
      if (this.portfolio.type === 'v2') {
        verification = {
          verifications: [this.option.verification.id],
        }
      } else {
        const type =
          this.option.verification.type === 'AnnotatedDocument'
            ? 'annotated_documents'
            : this.option.verification.type === 'LetterofAssurance'
            ? 'letter_of_assurances'
            : 'on_sites'
        verification[type] = [this.option.verification.id]
      }

      const { data } = await this.$axios.post(
        `api/version/${this.scorecard.version_id}?parts_list=only`,
        verification
      )
      this.listData = data
      this.addNewOption()
    },
  },
}
</script>
