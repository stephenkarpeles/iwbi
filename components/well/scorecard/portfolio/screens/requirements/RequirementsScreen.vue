<template>
  <div>
    <PortfolioScorecardWarningScreen :part="part" />
    <div class="rounded-md bg-white border border-primary-300">
      <BarTab v-model="currentTab" :tabs="getParts" />
      <div v-if="optionsList" class="flex flex-col">
        <!-- list of options based on currentTab -->
        <div v-for="(el, i) in optionsList.options" :key="i">
          <div class="px-8 py-6 flex flex-col space-y-2">
            <span class="text-primary-600 text-lg"
              >Option {{ i + 1 }}{{ el.name && `: ${el.name}` }}</span
            >
            <div
              v-if="el.certification || el.note"
              class="text-primary-600 text-sm border-l-4 border-primary-600"
            >
              <div class="pl-2">
                Note: <span v-html="parseCardWarning(el)"> </span>
              </div>
            </div>

            <span
              class="text-primary-900"
              v-html="addCitations(el.description, $store.state.shared.project)"
            ></span>

            <ol
              type="a"
              style="list-style-type: lower-alpha"
              class="pl-10 text-primary-900 list-disc"
            >
              <li
                v-for="(requirement, req_index) in el.requirements"
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

            <div
              v-if="el.verifications && el.verifications.length"
              class="flex space-x-2 border-l-4 border-secondary-700 text-primary-900"
            >
              <span class="pl-2">Verified by</span>
              <div
                v-for="(verification, ver_index) in el.verifications"
                :key="ver_index"
                class="rounded-sm px-1 bg-primary-100"
              >
                {{ verification.name }}
              </div>
            </div>
            <div
              v-if="part.letter_of_assurances.length > 0"
              class="flex space-x-2 border-l-4 border-secondary-700 text-primary-900"
            >
              <span class="pl-2">Verified by</span>
              <div
                v-for="(loa, loa_index) in part.letter_of_assurances"
                :key="loa_index"
                class="rounded-sm px-1 bg-primary-100"
              >
                Letter Of Assurance - {{ loa.name }}
              </div>
            </div>
            <div
              v-if="part.annotated_documents.length > 0"
              class="flex space-x-2 border-l-4 border-secondary-700 text-primary-900"
            >
              <span class="pl-2">Verified by</span>
              <div
                v-for="(adoc, adoc_index) in part.annotated_documents"
                :key="adoc_index"
                class="rounded-sm px-1 bg-primary-100"
              >
                {{ adoc.name }}
              </div>
            </div>
            <div
              v-if="part.on_sites.length > 0"
              class="flex space-x-2 border-l-4 border-secondary-700 text-primary-900"
            >
              <span class="pl-2">Verified by</span>
              <div
                v-for="(onsite, onsite_index) in part.on_sites"
                :key="onsite_index"
                class="rounded-sm px-1 bg-primary-100"
              >
                {{ onsite.name }}
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
                  Letter Of Assurance - {{ role }}
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
                  v-if="hasLoaForRole(el, role)"
                  icon="download"
                  class="tx-info tx-12 mg-r-10"
                  @click.native="downloadLoaForRole(role)"
                  >Letter of Assurance -
                  <span class="uppercase">{{ role }}</span>
                </WLinksBase>
              </div>
            </div>
          </div>
          <div v-if="showDivider(i, optionsList.options)" class="relative">
            <div class="absolute inset-0 flex items-center" aria-hidden="true">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center">
              <span class="px-2 text-white bg-gray-500 rounded-md">
                {{ optionsList.condition }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { globalMixin } from '~/mixins/globalMixin'
export default {
  mixins: [globalMixin],
  props: {
    part: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      currentTab: '',
    }
  },
  computed: {
    applicableLoAs() {
      if (this.part.letter_of_assurances.length) {
        return this.part.letter_of_assurances.map((a) => a.name)
      }
      return []
    },
    getParts() {
      const parts = JSON.parse(JSON.stringify(this.part.subParts))
      return parts.map((el) => {
        if (el.space_types_excluded.length) {
          return {
            name:
              this.$options.filters.getSubPartTitle(el.space_types_included) +
              ' except ' +
              this.$options.filters.getSubPartTitle(el.space_types_excluded),
            value: el.id,
          }
        } else {
          return {
            name: this.$options.filters.getSubPartTitle(
              el.space_types_included
            ),
            value: el.id,
          }
        }
      })
    },
    optionsList() {
      return this.part.subParts.find((el) => el.id === this.currentTab)
    },
  },
  async mounted() {
    await this.$store.dispatch('scorecard/getPartNotes', this.part.id)
  },
  methods: {
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
    showDivider(index, list) {
      if (index === list.length - 1) return false
      return true
    },
    filterItems(needle, heystack) {
      const query = needle.toLowerCase()
      return heystack.filter((item) => item.toLowerCase().includes(query))
        .length
    },
    downloadLoaForRole(roleType) {
      const stage =
        this.$store.state.portfolio.portfolio.d_and_o === 1
          ? 'd&o'
          : 'certification'
      const url =
        this.$axios.defaults.baseURL +
        `api/loaExport/${this.$store.state.scorecard.scorecard.id}/part/${this.part.id}/${roleType}/stage/${stage}?token=${this.$store.state.authentication.token}`
      window.open(url, '_blank')
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
