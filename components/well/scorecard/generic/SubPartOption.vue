<template>
  <div>
    <div
      v-if="subPart.options.length > 1 && subPart.condition === 'OR'"
      class="py-3 text-primary-700 bg-primary-100 px-3 mb-3 border-primary-200 border rounded-lg"
    >
      Choose between the following:
    </div>
    <div class="space-y-2">
      <div
        v-for="(option, option_index) in subPart.options"
        :key="option_index"
      >
        <div class="shadow-md flex flex-wrap justify-between border rounded-md">
          <div
            v-if="
              option.applicable &&
              subPart.options.length > 1 &&
              subPart.condition === 'OR'
            "
            class="w-full bg-primary-50 rounded-t-md border-b px-8 py-4 text-primary-800 flex"
          >
            <div>
              <FormulateInput
                v-model="selectedOption"
                :value="option.id.toString()"
                type="radio"
                @click="sendSubPartChoice(option.id, subPart.id)"
              />
            </div>
            <div class="font-bold ml-2">
              {{ option.name }} {{ option.space_property }}
            </div>
          </div>
          <div
            v-if="option.certification || option.note"
            class="bg-primary-100 w-full border-l-4 border-primary-400 p-4"
          >
            <div class="flex">
              <div class="flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                  class="h-5 w-5 text-primary-400"
                >
                  <path
                    fill-rule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </div>
              <div class="ml-3">
                <!-- eslint-disable-next-line vue/no-v-html prettier/prettier -->
                <p class="text-sm text-primary-700">
                  <span class="font-bold">Certification note:</span>
                  <span v-if="option.certification">
                    Projects pursuing this strategy are limited in WELL
                    Certification level to {{ option.certification }},
                    regardless of total points achieved.
                  </span>
                  <span
                    v-else
                    v-html="
                      addCitations(option.note, $store.state.shared.project)
                    "
                  ></span>
                </p>
              </div>
            </div>
          </div>
          <div class="px-8 py-4 w-full justify-between text-primary-600">
            <div class="">
              <div
                v-if="option.name"
                class="text-sm font-bold text-primary-600 pb-2 italic"
              >
                {{ option_index + 1 }}: {{ option.name }}
              </div>
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
              </div>

              <!-- Loa for v2-pilot only -->
              <div v-if="part.letter_of_assurances.length" class="w-full mt-4">
                <WLinksBase
                  v-if="filterItems('Architect', applicableLoAs)"
                  icon="download"
                  class="tx-info tx-12 mg-r-10"
                  @click.native="downloadLoaForRole('Architect')"
                >
                  Architect LoA
                </WLinksBase>
                <WLinksBase
                  v-if="filterItems('Contractor', applicableLoAs)"
                  icon="download"
                  class="tx-info tx-12 mg-r-10"
                  @click.native="downloadLoaForRole('Contractor')"
                >
                  Contractor LoA
                </WLinksBase>
                <WLinksBase
                  v-if="filterItems('MEP', applicableLoAs)"
                  icon="download"
                  class="tx-info tx-12 mg-r-10"
                  @click.native="downloadLoaForRole('MEP')"
                >
                  MEP LoA
                </WLinksBase>
                <WLinksBase
                  v-if="filterItems('Owner', applicableLoAs)"
                  icon="download"
                  class="tx-info tx-12 mg-r-10"
                  @click.native="downloadLoaForRole('Owner')"
                >
                  Owner LoA
                </WLinksBase>
              </div>

              <!-- LOA downloads for v2 -->
              <div class="w-full mt-4">
                <WLinksBase
                  v-if="hasLoaForRole(option, 'architect')"
                  icon="download"
                  class="tx-info tx-12 mg-r-10"
                  @click.native="downloadLoaForRole('architect')"
                  >Letter of Assurance - Architect
                </WLinksBase>
                <WLinksBase
                  v-if="hasLoaForRole(option, 'contractor')"
                  icon="download"
                  class="tx-info tx-12 mg-r-10"
                  @click.native="downloadLoaForRole('contractor')"
                  >Letter of Assurance - Contractor
                </WLinksBase>
                <WLinksBase
                  v-if="hasLoaForRole(option, 'mep')"
                  icon="download"
                  class="tx-info tx-12 mg-r-10"
                  @click.native="downloadLoaForRole('mep')"
                  >Letter of Assurance - MEP
                </WLinksBase>
                <WLinksBase
                  v-if="hasLoaForRole(option, 'owner')"
                  icon="download"
                  class="tx-info tx-12 mg-r-10"
                  @click.native="downloadLoaForRole('owner')"
                  >Letter of Assurance - Owner
                </WLinksBase>
                <WLinksBase
                  v-if="hasLoaForRole(option, 'engineer')"
                  icon="download"
                  class="tx-info tx-12 mg-r-10"
                  @click.native="downloadLoaForRole('engineer')"
                  >Letter of Assurance - Engineer
                </WLinksBase>
                <WLinksBase
                  v-if="hasLoaForRole(option, 'designer')"
                  icon="download"
                  class="tx-info tx-12 mg-r-10"
                  @click.native="downloadLoaForRole('designer')"
                  >Letter of Assurance - Designer
                </WLinksBase>
              </div>
            </div>
          </div>
        </div>
        <div v-if="subPart.condition === 'OR'" class="ml-2 my-4">
          <span
            v-if="option_index !== subPart.options.length - 1"
            class="bg-secondary-500 border border-secondary-600 p-1 px-2 px-4 rounded shadow text-sm text-white"
          >
            OR
          </span>
        </div>
        <div v-if="subPart.condition === 'AND'" class="ml-2 my-4">
          <span
            v-if="option_index !== subPart.options.length - 1"
            class="bg-secondary-500 border border-secondary-600 p-1 px-2 px-4 rounded shadow text-sm text-white"
          >
            AND
          </span>
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
    subPart: {
      type: Object,
      required: true,
    },
    scorecardOption: {
      type: [String, Number],
      required: false,
      default() {
        return null
      },
    },
  },
  data() {
    return {
      selectedOption: '',
    }
  },
  computed: {
    ...mapState({
      activeMetric: (state) => state.scorecard.activeFilters.imperial,
      scorecard: (state) => state.scorecard.scorecard,
    }),
    applicableLoAs() {
      if (this.part.letter_of_assurances.length) {
        return this.part.letter_of_assurances.map((a) => a.name)
      }
      return []
    },
  },
  mounted() {
    this.selectedOption = this.scorecardOption.toString()
  },
  methods: {
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
    addCitations(fieldText, projectInfo = null) {
      fieldText = fieldText.replace(/<span>/g, '')
      fieldText = fieldText.replace(/<\/span>/g, '')
      fieldText = fieldText.replace(/CIT:/g, '')
      const pattern = /(<sup>(\[\d*(,*\d*-*\d*)*\])<\/sup>)/g
      const temp = fieldText.match(new RegExp(pattern.source, pattern.flags))
      if (temp) {
        const result = fieldText
          .match(new RegExp(pattern.source, pattern.flags))
          .map((match) => new RegExp(pattern.source, pattern.flags).exec(match))
        for (let i = 0; i < result.length; i++) {
          if (result[i] !== null) {
            const oldMatch = result[i][2]
            const newResult = ''
            fieldText = fieldText.replace(oldMatch, newResult)
          }
        }
      }
      return this.unitFilter(fieldText, projectInfo)
    },
    unitFilter(data, projectInfo = null) {
      let e = data
      const b = e.match(/{{well-unit}}(.*?){{\/well-unit}}/g)
      if (b && b.length) {
        b.forEach((element) => {
          const tagLength = element.length
          const tagIndex = e.indexOf('{{well-unit}}')
          let temp = element.replace(/{{\/?well-unit}}/g, '')
          temp = this.$store.state.scorecard.activeFilters.imperial
            ? temp.split('|')[0]
            : temp.split('|')[1]
          const firstString = e.slice(0, tagIndex)
          const secondString = e.slice(tagIndex + tagLength, e.length)
          e = firstString + temp + secondString
        })
      }
      if (projectInfo) {
        return this.pointsFilter(e, projectInfo)
      } else {
        return e
      }
    },
    pointsFilter(data, projectInfo) {
      const projectTypeIsWELLCore = projectInfo.project_type === 'cs'
      let e = data
      const b = e.match(/{{well-points}}(.*?){{\/well-points}}/g)
      if (b && b.length) {
        b.forEach((element) => {
          const tagLength = element.length
          const tagIndex = e.indexOf('{{well-points}}')
          let temp = element.replace(/{{\/?well-points}}/g, '')
          temp = !projectTypeIsWELLCore
            ? temp.split('|')[0]
            : temp.split('|')[1]
          const firstString = e.slice(0, tagIndex)
          const secondString = e.slice(tagIndex + tagLength, e.length)
          e = firstString + temp + secondString
        })
      }
      return e
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
      }
      this.$store.dispatch('scorecard/updatePart', data)
    },
    downloadLoaForRole(roleType) {
      const stage =
        this.$store.state.project.project.d_and_o === 1
          ? 'd&o'
          : 'certification'

      const metric = this.activeMetric ? 'imperial' : 'metric'
      const pointType = this.$store.state.scorecard.activeFilters.is_core
        ? 'core'
        : 'certification'

      const url =
        this.$axios.defaults.baseURL +
        `api/loaExport/${this.$store.state.scorecard.scorecard.id}/part/${this.part.id}/${roleType}/stage/${stage}?token=${this.$store.state.authentication.token}&unit_filter=${metric}&point_filter=${pointType}`
      window.open(url, '_blank')
    },
    filterItems(needle, heystack) {
      const query = needle.toLowerCase()
      return heystack.filter((item) => item.toLowerCase().includes(query))
        .length
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
