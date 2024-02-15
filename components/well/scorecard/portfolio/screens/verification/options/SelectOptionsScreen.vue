<template>
  <div v-if="!removeModal">
    <div :class="['space-y-4 mt-4 max-h-96']">
      <div
        v-for="(optionGroup, groupIndex) in options"
        :key="groupIndex"
        :class="[
          optionGroup[0].condition === 'AND' &&
            'border-primary-300 rounded-lg border',
        ]"
      >
        <div
          v-for="(el, i) in optionGroup"
          :key="i"
          :class="[
            el.condition === 'OR' && 'mb-5 border-primary-300 border',
            'p-6 rounded-lg bg-primary-100 flex justify-between relative',
            el.condition === 'AND' &&
              i !== optionGroup.length - 1 &&
              'border-primary-300 border-b',
          ]"
        >
          <div :class="['flex flex-col']">
            <span class="text-primary-800"
              >Option{{ ' ' + el.option_order }}
              <span class="font-normal">
                {{ el.name ? ': ' + el.name : '' }}</span
              ></span
            >
            <span class="text-primary-800 text-sm">{{ el.subpart_name }}</span>
            <div v-if="scorecard.type === 'v2-pilot'">
              <div v-if="v2PVerifications.length">
                <span
                  v-for="(ver, index) in v2PVerifications"
                  :key="index"
                  class="text-primary-900 opacity-50 text-sm"
                >
                  {{ ver.name
                  }}{{
                    v2PVerifications.length > 1 &&
                    index !== v2PVerifications.length - 1
                      ? ','
                      : ''
                  }}
                </span>
              </div>
            </div>
            <div v-else>
              <div v-if="el.verifications.length">
                <span
                  v-for="(ver, index) in el.verifications"
                  :key="index"
                  class="text-primary-900 opacity-50 text-sm"
                >
                  {{ ver.name
                  }}{{
                    el.verifications.length > 1 &&
                    index !== el.verifications.length - 1
                      ? ','
                      : ''
                  }}
                </span>
              </div>
            </div>
          </div>
          <div class="w-24">
            <div v-if="el.selected_id">
              <WButtonsBase
                v-if="el.condition === 'AND' && i === 0"
                type="primaryInverted"
                @click.native="
                  ;(removeModal = true),
                    ($parent.$parent.removeModal = true),
                    (option = el)
                "
              >
                Remove</WButtonsBase
              >
              <WButtonsBase
                v-else-if="el.condition === 'OR'"
                type="primaryInverted"
                @click.native="
                  ;(removeModal = true),
                    ($parent.$parent.removeModal = true),
                    (option = el)
                "
              >
                Remove</WButtonsBase
              >
            </div>
            <WButtonsBase
              v-else-if="el.condition === 'OR'"
              @click.native="addOption(el), (adding = el.id)"
            >
              <WLoadingSpinner
                v-if="adding === el.id"
                class="mx-auto"
                type="button"
              /><span v-else>Add</span></WButtonsBase
            >
            <WButtonsBase
              v-else-if="el.condition === 'AND' && i === 0"
              @click.native="addOption(el), (adding = el.id)"
            >
              <WLoadingSpinner
                v-if="adding === el.id"
                class="mx-auto"
                type="button"
              /><span v-else>Add</span>
            </WButtonsBase>
          </div>
          <div
            v-if="el.condition === 'AND' && i !== optionGroup.length - 1"
            class="w-full flex absolute bottom-0 z-10 translate-y-1/2 -translate-x-1/1"
          >
            <div
              class="-translate-x-1/2 mx-auto bg-primary-200 rounded-lg px-2 text-sm py-1"
            >
              AND
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <div>
      <div class="flex mb-4 space-x-2">
        <div
          class="flex flex-shrink-0 h-8 items-center justify-center mx-auto rounded-full sm:mx-0 w-8"
        >
          <svg
            class="h-8 w-8 text-red-600"
            x-description="Heroicon name: outline/exclamation"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            ></path>
          </svg>
        </div>
        <div>
          <div class="text-primary-800 font-bold leading-5 text-base">
            Remove option
          </div>
          <div class="mb-5 text-primary-800 py-2">
            Are you sure you would like to remove this option? Documents
            uploaded to this option will be deleted
          </div>
        </div>
      </div>
      <div class="flex justify-between space-x-5">
        <div class="w-24">
          <WButtonsBase
            type="primaryInverted"
            @click.native="
              ;(removeModal = false),
                ($parent.$parent.removeModal = false),
                (removing = '')
            "
          >
            Cancel
          </WButtonsBase>
        </div>
        <div class="w-24">
          <WButtonsBase
            type="danger"
            @click.native="removeOption(option), (removing = option.id)"
          >
            <WLoadingSpinner
              v-if="removing !== ''"
              class="mx-auto"
              type="button"
            /><span v-else>Remove</span></WButtonsBase
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
  },
  data() {
    return {
      option: null,
      adding: '',
      removing: '',
      removeModal: false,
    }
  },
  computed: {
    ...mapState({
      scorecard: (state) => state.scorecard.scorecard,
      selectedOptions: (state) => state.scorecard.selectedOptions,
    }),
    v2PVerifications() {
      const letterOfAssurance = this.part.letter_of_assurances.map((e) => {
        return { ...e, name: 'Letter Of Assurance - ' + e.name }
      })
      return [
        ...this.part.annotated_documents,
        ...letterOfAssurance,
        ...this.part.on_sites,
      ]
    },
    options() {
      const optionGroups = []
      this.part.subParts.forEach((el) => {
        const group = []
        let title = this.$options.filters.getSubPartTitle(
          el.space_types_included
        )
        if (el.space_types_excluded.length) {
          title +=
            ' except ' +
            this.$options.filters.getSubPartTitle(el.space_types_excluded)
        }
        el.options.forEach((option) => {
          option.subpart_name = title
          option.condition = el.condition
          group.push(option)
        })
        optionGroups.push(group)
      })

      optionGroups.forEach((group) => {
        if (this.selectedOptions.length) {
          group.forEach((option) => {
            const match = this.selectedOptions.find(
              (el) => el.option_id === option.id
            )
            if (match) {
              option.selected_id = match.id
            } else {
              option.selected_id = null
            }
          })
        } else {
          group.forEach((option) => {
            option.selected_id = null
          })
        }
      })
      return optionGroups
    },
  },
  methods: {
    async addOption(option) {
      try {
        const res = await this.$axios.post(
          `api/scorecard/${this.scorecard.id}/part/${this.part.id}/sub_part/${option.sub_part_id}/option/${option.id}`
        )
        if (res.status === 200) {
          await this.updateState(
            'Option selected!',
            res.data.optionSelectionList,
            false
          )
        }
      } catch (error) {
        this.$store.dispatch('notifications/toastMessage', {
          message: error.response.data.msg,
        })
      }
      this.adding = ''
    },
    async removeOption(option) {
      try {
        const res = await this.$axios.delete(
          `api/scorecard/${this.scorecard.id}/part/${this.part.id}/scorecard_part/${option.selected_id}`
        )
        if (res.status === 200) {
          this.removeModal = false
          this.$parent.$parent.removeModal = false
          await this.updateState(
            'Option removed!',
            res.data.optionSelectionList.length
              ? res.data.optionSelectionList
              : [res.data.scorecard_part],
            false
          )
        }
      } catch (error) {
        this.$store.dispatch('notifications/toastMessage', {
          message: error.response.data.msg,
        })
      }
      this.removing = ''
      this.removeModal = false
      this.$parent.$parent.removeModal = true
      this.$parent.isHidden = true
    },

    async updateState(msg, data, hide) {
      await this.$store.dispatch('scorecard/getSelectedOptions', {
        part_id: this.part.id,
      })
      if (this.selectedOptions.length) {
        await this.$store.dispatch('scorecard/getPartVerifications', {
          part_id: this.part.id,
        })
      }
      this.$store.dispatch('scorecard/updatePartAttribute', {
        part_id: this.part.id,
        attribute: 'scorecard_part',
        data,
      })
      this.$parent.isHidden = hide
      this.$store.dispatch('notifications/toastMessage', {
        message: msg,
      })
    },
  },
}
</script>
