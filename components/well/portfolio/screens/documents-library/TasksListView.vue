<template>
  <div class="bg-white p-4">
    <ModalsGeneral
      ref="locationsModal"
      :header="selectedOption ? selectedOption.verification.name : ''"
      :header-background="noBakground"
    >
      <div style="width: 600px" class="px-6">
        <PortfolioScorecardTodoListScreen
          :part="part"
          :option="selectedOption"
        />
      </div>
    </ModalsGeneral>
    <ModalsGeneral
      ref="uploadDocModal"
      :show-back-option="mode === 'locations'"
      :header="mode === 'locations' ? '' : 'Upload a Document'"
      :header-background="noBakground"
    >
      <div style="width: 1000px">
        <PortfolioScoreUploadDocScreen
          :mode-name="mode"
          :part="part"
          :option="selectedOption"
          :task-verification="verificationList"
        />
      </div>
    </ModalsGeneral>
    <div class="flex flex-col space-y-4">
      <div
        v-for="(el, i) in verificationList"
        :key="i"
        class="rounded-md border-primary-500 border px-4 py-2"
      >
        <div class="flex space-x-3 items-center">
          <span class="text-primary-900 text-lg font-semibold"
            >{{
              el.type === 'LetterofAssurance'
                ? 'Letter of Assurance - ' + el.name
                : el.name
            }}
          </span>
          <span v-if="el.is_auditable" class="text-sm text-yellow-700"
            ><span
              class="flex-shrink-0 inline-block h-2 w-2 bg-yellow-500 rounded-full"
              aria-hidden="true"
            ></span>
            Audit</span
          >
        </div>
        <div class="divide-y divide-primary-400">
          <div v-for="(option, index) in el.options" :key="index">
            <div
              v-if="
                $attrs.subtab === 'completed' &&
                option.completed === option.total
              "
              class="flex items-center justify-between py-2"
            >
              <div class="flex text-primary-900 opacity-70">
                <span class="font-semibold"
                  >Option {{ option.option_order
                  }}{{ option.name ? ': ' + option.name : '' }}</span
                >
                <div class="text-primary-800 opacity-100 border-l-2 mx-2"></div>
                <span>{{ option.space_types_included | getSubPartTitle }}</span>
              </div>
              <div class="flex items-center space-x-8">
                <div v-if="option.total" class="flex items-center space-x-2">
                  <ProgressCircle
                    :radius="12"
                    :stroke="2"
                    :progress="(option.completed / option.total) * 100"
                  />
                  <button
                    class="underline text-primary-600 hover:text-primary-500"
                    @click="
                      ;(selectedOption = { ...option, verification: el }),
                        ($refs.locationsModal.isHidden = false)
                    "
                  >
                    {{ option.completed }}/{{ option.total }} Locations
                  </button>
                </div>
                <div v-else>
                  <span class="text-primary-1200 opacity-50"
                    >0 locations assigned</span
                  >
                </div>
                <div>
                  <WButtonsBase
                    :disabled="
                      option.total <= 0 || option.total === option.completed
                    "
                    class="shadow-none font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    @click.native="
                      ;(selectedOption = { ...option, verification: el }),
                        ($refs.uploadDocModal.isHidden = false)
                    "
                    >Upload
                  </WButtonsBase>
                </div>
              </div>
            </div>
            <div
              v-else-if="
                $attrs.subtab === 'pending' && option.completed !== option.total
              "
              class="flex items-center justify-between py-2"
            >
              <div class="flex text-primary-900 opacity-70">
                <span class="font-semibold"
                  >Option {{ option.option_order
                  }}{{ option.name ? ': ' + option.name : '' }}</span
                >
                <div class="text-primary-800 opacity-100 border-l-2 mx-2"></div>
                <span>{{ option.space_types_included | getSubPartTitle }}</span>
              </div>
              <div class="flex items-center space-x-8">
                <div v-if="option.total" class="flex items-center space-x-2">
                  <ProgressCircle
                    :radius="12"
                    :stroke="2"
                    :progress="(option.completed / option.total) * 100"
                  />
                  <button
                    class="underline text-primary-600 hover:text-primary-500"
                    @click="
                      ;(selectedOption = { ...option, verification: el }),
                        ($refs.locationsModal.isHidden = false)
                    "
                  >
                    {{ option.completed }}/{{ option.total }} Locations
                  </button>
                </div>
                <div v-else>
                  <span class="text-primary-1200 opacity-50"
                    >0 locations assigned</span
                  >
                </div>
                <div>
                  <WButtonsBase
                    v-if="
                      portfolio.agreement_status !== 0 &&
                      portfolio.agreement_status !== null
                    "
                    :disabled="
                      option.total <= 0 || option.total === option.completed
                    "
                    class="shadow-none font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    @click.native="
                      ;(selectedOption = { ...option, verification: el }),
                        ($refs.uploadDocModal.isHidden = false)
                    "
                    >Upload
                  </WButtonsBase>
                  <Flyout v-else y="bottom" x="left" class="h-full">
                    <WButtonsBase
                      :disabled="
                        option.total <= 0 || option.total === option.completed
                      "
                      class="shadow-none font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                      >Upload
                    </WButtonsBase>
                    <template #content>
                      <div
                        class="text-sm w-52 text-center p-2 text-primary-600"
                      >
                        Please sign the legal agreement before uploading
                        documents
                      </div>
                    </template>
                  </Flyout>
                </div>
              </div>
            </div>
            <div
              v-if="
                $attrs.subtab !== 'completed' && $attrs.subtab !== 'pending'
              "
              class="flex items-center justify-between py-2"
            >
              <div class="flex text-primary-900 opacity-70">
                <span class="font-semibold"
                  >Option {{ option.option_order
                  }}{{ option.name ? ': ' + option.name : '' }}</span
                >
                <div class="text-primary-800 opacity-100 border-l-2 mx-2"></div>
                <span>{{ option.space_types_included | getSubPartTitle }}</span>
              </div>
              <div class="flex items-center space-x-8">
                <div v-if="option.total" class="flex items-center space-x-2">
                  <ProgressCircle
                    :radius="12"
                    :stroke="2"
                    :progress="(option.completed / option.total) * 100"
                  />
                  <button
                    class="underline text-primary-600 hover:text-primary-500"
                    @click="
                      ;(selectedOption = { ...option, verification: el }),
                        ($refs.locationsModal.isHidden = false)
                    "
                  >
                    {{ option.completed }}/{{ option.total }} Locations
                  </button>
                </div>
                <div v-else>
                  <span class="text-primary-1200 opacity-50"
                    >0 locations assigned</span
                  >
                </div>
                <div>
                  <WButtonsBase
                    v-if="
                      portfolio.agreement_status !== 0 &&
                      portfolio.agreement_status !== null
                    "
                    :disabled="
                      option.total <= 0 || option.total === option.completed
                    "
                    class="shadow-none font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    @click.native="
                      ;(selectedOption = { ...option, verification: el }),
                        ($refs.uploadDocModal.isHidden = false)
                    "
                    >Upload
                  </WButtonsBase>
                  <Flyout v-else y="bottom" x="left" class="h-full">
                    <WButtonsBase
                      :disabled="
                        option.total <= 0 || option.total === option.completed
                      "
                      class="shadow-none font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                      >Upload
                    </WButtonsBase>
                    <template #content>
                      <div
                        class="text-sm w-52 text-center p-2 text-primary-600"
                      >
                        Please sign the legal agreement before uploading
                        documents
                      </div>
                    </template>
                  </Flyout>
                </div>
              </div>
            </div>
          </div>
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
    locationType: {
      type: String,
      default: '',
      required: false,
    },
  },
  data() {
    return {
      selectedOption: null,
      verifications: [],
      noBakground: true,
      mode: '',
    }
  },
  computed: {
    ...mapState({
      portfolio: (state) => state.portfolio.portfolio,
      scorecard: (state) => state.scorecard.scorecard,
    }),
    verificationList() {
      if (this.locationType === 'all') {
        return this.verifications
      } else {
        const options = []
        this.verifications.forEach((el) => {
          if (this.locationType === 'pending') {
            if (el.options.filter((e) => e.completed < e.total).length) {
              options.push({
                ...el,
                options: el.options.filter((e) => e.completed < e.total),
              })
            }
          } else if (
            el.options.filter((e) => e.completed >= e.total && e.total > 0)
              .length
          ) {
            options.push({
              ...el,
              options: el.options.filter(
                (e) => e.completed >= e.total && e.total > 0
              ),
            })
          }
        })
        return options
      }
    },
  },
  created() {
    this.verifications = JSON.parse(JSON.stringify(this.part.verifications))
  },
  methods: {
    async getVerifications() {
      await this.$axios
        .get(
          `api/scorecard/${this.scorecard.id}/part/${this.part.id}/verifications`
        )
        .then((res) => {
          if (res.status === 200) this.verifications = res.data
          this.$parent.verificationLoaded = true
        })
    },
  },
}
</script>
