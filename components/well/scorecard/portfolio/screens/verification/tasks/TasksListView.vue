<template>
  <div>
    <ModalsGeneral
      ref="locationsModal"
      :header="selectedOption ? selectedOption.verification.name : ''"
      :header-background="noBakground"
    >
      <div style="width: 600px" class="px-6 overflow-x-auto overflow-y-auto">
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
      <div style="width: 1000px" class="px-6 overflow-x-auto overflow-y-auto">
        <PortfolioScorecardUploadDocScreen
          :mode-name="mode"
          :part="part"
          :option="selectedOption"
        />
      </div>
    </ModalsGeneral>
    <div class="flex flex-col space-y-4">
      <div
        v-for="(el, i) in verificationList"
        :key="i"
        class="bg-white rounded-md px-4 py-3 border-primary-300 border"
      >
        <div class="flex space-x-3 items-center">
          <span class="text-primary-900 text-lg font-semibold">{{
            el.type === 'LetterofAssurance'
              ? 'Letter of Assurance - ' + el.name
              : el.name
          }}</span>
          <span v-if="el.is_auditable" class="text-sm text-yellow-700"
            ><span
              class="flex-shrink-0 inline-block h-2 w-2 bg-yellow-500 rounded-full"
              aria-hidden="true"
            ></span>
            Audit</span
          >
        </div>
        <div class="divide-y divide-primary-600">
          <div
            v-for="(option, index) in el.options"
            :key="index"
            class="flex items-center justify-between py-2"
          >
            <div class="text-primary-900 opacity-80 max-w-2xl">
              <span
                v-if="option.option_order || option.name"
                class="font-medium"
                >Option {{ option.option_order
                }}{{ option.name ? ': ' + option.name : '' }}</span
              >

              <span class="border-l-2 border-primary-400 ml-1 mr-2"></span>
              <span class="font-light"
                >{{ option.space_types_included | getSubPartTitle
                }}<span v-if="option.space_types_excluded.length">
                  except
                  {{ option.space_types_excluded | getSubPartTitle }}</span
                ></span
              >
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
                  :type="
                    option.total <= 0 || option.total === option.completed
                      ? 'neutral'
                      : 'primary'
                  "
                  :class="[
                    option.total <= 0 || option.total === option.completed
                      ? 'bg-gray-400 text-black'
                      : '',
                    'rounded-lg shadow-lg shadow-none font-semibold disabled:opacity-50 disabled:cursor-not-allowed',
                  ]"
                  @click.native="
                    ;(selectedOption = { ...option, verification: el }),
                      ($refs.uploadDocModal.isHidden = false)
                  "
                >
                  Upload
                </WButtonsBase>
                <Flyout v-else y="bottom" x="left" class="h-full">
                  <WButtonsBase
                    :disabled="
                      option.total <= 0 || option.total === option.completed
                    "
                    :type="
                      option.total <= 0 || option.total === option.completed
                        ? 'neutral'
                        : 'primary'
                    "
                    :class="[
                      option.total <= 0 || option.total === option.completed
                        ? 'bg-gray-400 text-black'
                        : '',
                      'rounded-lg shadow-lg shadow-none font-semibold disabled:opacity-50 disabled:cursor-not-allowed',
                    ]"
                  >
                    Upload
                  </WButtonsBase>
                  <template #content>
                    <div class="text-sm w-52 text-center p-2 text-primary-600">
                      Please sign the legal agreement before uploading documents
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
      selectedOption: null,
      noBakground: true,
      mode: '',
    }
  },
  computed: {
    ...mapState({
      portfolio: (state) => state.portfolio.portfolio,
      scorecard: (state) => state.scorecard.scorecard,
      verificationList: (state) => state.scorecard.activeVerificationsList,
    }),
  },
  async mounted() {
    await this.$store.dispatch('scorecard/getPartVerifications', {
      part_id: this.part.id,
    })
  },
}
</script>
