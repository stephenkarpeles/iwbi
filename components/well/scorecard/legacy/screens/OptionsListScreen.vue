<template>
  <div
    :style="{
      height: '500px',
    }"
    class="overflow-y-auto space-y-4"
  >
    <ModalsConfirm
      v-if="mode === 'changeOption'"
      ref="changeOptionModal"
      @confirm="sendSubPartChoice(selectedOpId, selectedSubId)"
    >
      <template slot="body">
        <div class="sm:flex sm:items-start">
          <div
            class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"
          >
            <WIconsBase class="h-6 w-6 text-red-600" icon="exclamation" />
          </div>
          <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            <h3
              id="modal-title"
              class="text-lg leading-6 font-medium text-gray-900"
            >
              Change Option
            </h3>
            <div class="mt-2">
              <p class="text-sm text-gray-500">
                Warn that choosing a different option will reset their uploads
                because it may be a different verification method
              </p>
            </div>
          </div>
        </div>
      </template>
    </ModalsConfirm>
    <CardHorizontal
      v-for="(option, option_index) in subPart.options"
      :key="option_index"
      :class="`${
        activeOption && option.id === activeOption.id ? 'bg-gray-50' : ''
      }`"
      :card-data="{
        warning:
          option.certification || option.note ? parseCardWarning(option) : null,
      }"
    >
      <template slot="header">
        <div class="flex space-x-2 items-center">
          <WIconsBase icon="checklist-icon" />
          <span class="text-primary-800 font-semibold">
            {{ option.name }} {{ option.space_property }}
          </span>
        </div>
      </template>
      <template slot="action">
        <span
          v-if="activeOption && option.id === activeOption.id"
          class="text-primary-600"
          >Current Option</span
        >
        <div v-else class="w-24">
          <WButtonsBase
            class="items-center text-base"
            icon-position="right"
            icon="arrow-sm-right"
            @click.native="selectSubpart(option.id, subPart.id)"
          >
            Select
          </WButtonsBase>
        </div>
      </template>
      <template slot="body">
        <div class="w-full justify-between text-primary-600">
          <div>
            <!-- eslint-disable-next-line vue/no-v-html -->
            <span
              v-html="
                addCitations(option.description, $store.state.shared.project)
              "
            ></span>
          </div>
          <ol
            type="a"
            style="list-style-type: lower-alpha"
            class="pl-5 text-gray-500 text-sm list-disc"
          >
            <li
              v-for="(requirement, req_index) in option.requirements"
              :key="req_index"
            >
              <!-- eslint-disable-next-line vue/no-v-html -->
              <div
                class="requirementStyles"
                v-html="
                  addCitations(
                    requirement.description,
                    $store.state.project.project
                  )
                "
              />
            </li>
          </ol>
          <div class="flex flex-wrap mt-2 p-2 rounded text-sm">
            <div class="space-x-2 flex w-full">
              <div class="my-auto">Verified by:</div>
              <div
                v-for="(verification, ver_index) in option.verifications"
                :key="ver_index"
                class="bg-primary-700 flex my-auto px-3 py-1 rounded-full text-white mr-1"
              >
                <div>
                  {{ verification.name }}
                </div>
              </div>
              <div
                v-if="part.letter_of_assurances.length > 0"
                class="flex my-auto"
              >
                <div
                  v-for="(loa, loa_index) in part.letter_of_assurances"
                  :key="loa_index"
                  class="bg-primary-700 flex my-auto px-3 py-1 rounded-full text-white mr-1"
                >
                  {{ loa.name }} LoA
                </div>
              </div>
              <div
                v-if="part.annotated_documents.length > 0"
                class="flex my-auto"
              >
                <div
                  v-for="(adoc, adoc_index) in part.annotated_documents"
                  :key="adoc_index"
                  class="bg-primary-700 flex my-auto px-3 py-1 rounded-full text-white mr-1"
                >
                  {{ adoc.name }}
                </div>
              </div>
              <div v-if="part.on_sites.length > 0" class="flex my-auto">
                <div
                  v-for="(onsite, onsite_index) in part.on_sites"
                  :key="onsite_index"
                  class="bg-primary-700 flex my-auto px-3 py-1 rounded-full text-white mr-1"
                >
                  {{ onsite.name }}
                </div>
              </div>
              <div
                v-if="part.photographic_verification"
                class="bg-primary-700 flex my-auto px-3 py-1 rounded-full text-white"
              >
                Photographic evidence
              </div>
            </div>

            <!-- Loa for v2-pilot only -->
            <div v-if="part.letter_of_assurances.length" class="w-full mt-4">
              <div
                v-for="(role, index) in [
                  'Architect',
                  'Contractor',
                  'MEP',
                  'Owner',
                ]"
                :key="index"
              >
                <WLinksBase
                  v-if="filterItems(role, applicableLoAs)"
                  icon="download"
                  class="tx-info tx-12 mg-r-10"
                  @click.native="downloadLoaForRole(role)"
                >
                  {{ role }} LoA
                </WLinksBase>
              </div>
            </div>

            <!-- LOA downloads for v2 -->
            <div class="w-full mt-4">
              <div
                v-for="(role, index) in [
                  'architect',
                  'contractor',
                  'mep',
                  'owner',
                  'engineer',
                  'designer',
                ]"
                :key="index"
              >
                <WLinksBase
                  v-if="hasLoaForRole(option, role)"
                  icon="download"
                  class="tx-info tx-12 mg-r-10"
                  @click.native="downloadLoaForRole(role)"
                  >Letter of Assurance -
                  <span class="uppercase">{{ role }}</span>
                </WLinksBase>
              </div>
            </div>
          </div>
        </div>
      </template>
    </CardHorizontal>
  </div>
</template>

<script>
import { globalMixin } from '~/mixins/globalMixin'
export default {
  mixins: [globalMixin],
  props: {
    mode: {
      type: String,
      required: false,
      default: '',
    },
    subPart: {
      type: Object,
      required: true,
    },
    part: {
      type: Object,
      required: true,
    },
    activeOption: {
      type: Object,
      required: false,
      default: null,
    },
  },
  data() {
    return {
      selectedOpId: null,
      selectedSubId: null,
    }
  },
  computed: {
    applicableLoAs() {
      if (this.part.letter_of_assurances.length) {
        return this.part.letter_of_assurances.map((a) => a.name)
      }
      return []
    },
    scorecardPartID() {
      return this.part.scorecard_part.find(
        (el) => el.sub_part_id === this.activeOption.sub_part_id
      )?.id
    },
  },
  methods: {
    filterItems(needle, heystack) {
      const query = needle.toLowerCase()
      return heystack.filter((item) => item.toLowerCase().includes(query))
        .length
    },
    downloadLoaForRole(roleType) {
      const stage =
        this.$store.state.project.project.d_and_o === 1
          ? 'd&o'
          : 'certification'
      const url =
        this.$axios.defaults.baseURL +
        `api/loaExport/${this.$store.state.scorecard.scorecard.id}/part/${this.part.id}/${roleType}/stage/${stage}?token=${this.$store.state.authentication.token}`
      window.open(url, '_blank')
    },
    hasLoaForRole(option, roleType) {
      if (option.verifications.length > 0) {
        for (let i = 0; i < option.verifications.length; i++) {
          if (
            option.verifications[i].name
              .toLowerCase()
              .includes('letter of assurance') &&
            option.verifications[i].name.toLowerCase().includes(roleType)
          ) {
            return true
          }
        }
      }
      return false
    },
    parseCardWarning(option) {
      let msg = null
      if (option.certification) {
        msg = `Projects pursuing this strategy are limited in WELL
                    Certification level to ${option.certification},
                    regardless of total points achieved.`
      } else {
        msg = this.addCitations(option.note, this.$store.state.shared.project)
      }
      return msg
    },
    selectSubpart(opId, subId) {
      if (this.mode === 'changeOption') {
        this.$refs.changeOptionModal.isHidden = false
        this.selectedOpId = opId
        this.selectedSubId = subId
      } else {
        this.sendSubPartChoice(opId, subId)
      }
    },

    sendSubPartChoice(optionId, subPartId) {
      const data = {
        partId: this.part.id,
        response: this.$parent.$parent.response
          ? this.$parent.$parent.response
          : 'yes',
        concept: this.part.concept_name,
        version_id: this.$store.state.scorecard.scorecard.version_id,
        option_id: optionId,
        sub_part_id: subPartId,
        points: this.part.points,
        response_reason: 'User-entered',
        phase: 'assessment',
        isPortfolio: true,
      }
      this.$store.dispatch('scorecard/updatePart', data).then(async (res) => {
        await this.$store.dispatch('scorecard/getVerificationList', {
          scorecardPartID: this.scorecardPartID,
        })
      })
      this.$parent.isHidden = true
    },
  },
}
</script>

<style scoped>
.requirementStyles >>> tr {
  @apply px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 tracking-wider;
}
.requirementStyles >>> td {
  @apply p-4 border border-primary-200;
}
.requirementStyles >>> table {
  @apply border rounded-lg border-primary-200 mt-3 mb-5 max-w-2xl;
}
.requirementStyles >>> ol {
  @apply list-decimal ml-5 m-3 space-y-2 text-sm max-w-2xl;
}
.requirementStyles >>> ul {
  @apply list-disc ml-5 m-3 space-y-2 text-sm max-w-2xl;
}
</style>
